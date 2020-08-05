export interface Schedule {
    week_day: number;
    from: number;
    to: number;
    class_id: number;
}

export interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}