export class ConvertDate {
  formatTime(timestamp: string, duration: number = 0) {
    const dt = new Date(timestamp);
    dt.setMinutes(dt.getMinutes() + duration);

    const formattedTime = `${dt.toISOString().split('T')[1].slice(0, 5)}`;
    return formattedTime;
  }
  timeToMinutes(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
