export const humanDate = (dateString: string) => {
    const date: Date = new Date(`${dateString}T12:00:00`)
    const config: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return Intl.DateTimeFormat('en-US', config).format(date)        
}