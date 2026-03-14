import { HabitRepository } from "@/src/repository/habitRepository";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function StatsScreen() {
  const theme = useTheme();
  const [statsMap, setStatsMap] = useState<Record<string, any[]>>({});
  const [dates, setDates] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const generateDates = (firstDate: string): string[] => {
    const start = new Date(firstDate);
    const today = new Date();
    const dateArray: string[] = [];
    
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      dateArray.push(new Date(d).toISOString().split('T')[0]);
    }
    
    return dateArray;
  };

  const loadStats = useCallback(async () => {
    const firstDate = await HabitRepository.getFirstLogDate();
    const allDates = generateDates(firstDate);
    setDates(allDates);
    
    // Start at the last date (today)
    const todayIndex = allDates.length - 1;
    setCurrentIndex(todayIndex);
    
    // Load stats for all dates
    const statsData: Record<string, any[]> = {};
    for (const date of allDates) {
      const res = await HabitRepository.getLogsByDay(date);
      statsData[date] = res || [];
    }
    setStatsMap(statsData);
  }, []);

  const loadStatsForDate = async (date: string) => {
    if (!statsMap[date]) {
      const res = await HabitRepository.getLogsByDay(date);
      setStatsMap(prev => ({ ...prev, [date]: res || [] }));
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsChanging(true);
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    
    if (index !== currentIndex && index >= 0 && index < dates.length) {
      setCurrentIndex(index);
      loadStatsForDate(dates[index]);
    }
    setIsChanging(false)
  };

  const goToPrevious = () => {
    setIsChanging(true)
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      loadStatsForDate(dates[newIndex]);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
    setIsChanging(false);
  };

  const goToNext = () => {
    setIsChanging(true)
    if (currentIndex < dates.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      loadStatsForDate(dates[newIndex]);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
    setIsChanging(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderPage = ({ item }: { item: string }) => {
    const pageStats = statsMap[item] || [];
    
    return (
      <View style={[styles.page, { width: SCREEN_WIDTH }]}>
        <View style={styles.content}>
          {pageStats.length > 0 ? (
            pageStats.map((habit: any, index: number) => (
              <Card key={`${habit.name}-${index}`} style={styles.habitCard} mode="elevated">
                <Card.Content style={styles.cardContent}>
                  <IconButton
                    icon="checkbox-marked-circle"
                    size={24}
                    iconColor={theme.colors.primary}
                    style={styles.checkbox}
                  />
                  <Text variant="bodyLarge">{habit.name}</Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text variant="bodyMedium" style={styles.emptyText}>
              No completed habits on this day
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={28}
          onPress={goToPrevious}
          disabled={currentIndex === 0}
        />
        <View style={styles.dateContainer}>
          <Text variant="headlineSmall" style={styles.title}>
            {dates[currentIndex] ? formatDate(dates[currentIndex]) : 'Loading...'}
          </Text>
          {!isChanging &&
          <Text variant="bodySmall" style={styles.subtitle}>
             ${currentIndex + 1} of ${dates.length} days
          </Text>}
        </View>
        <IconButton
          icon="chevron-right"
          size={28}
          onPress={goToNext}
          disabled={currentIndex === dates.length - 1}
        />
      </View>

      {dates.length > 0 && (
        <FlatList
          ref={flatListRef}
          data={dates}
          renderItem={renderPage}
          keyExtractor={(item) => item}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          initialScrollIndex={dates.length - 1}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    opacity: 0.6,
    marginTop: 4,
  },
  page: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  habitCard: {
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    margin: 0,
    marginRight: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    opacity: 0.6,
  },
});
