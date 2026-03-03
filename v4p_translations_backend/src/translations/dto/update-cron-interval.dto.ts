import { IsIn, IsInt } from 'class-validator';

const ALLOWED_INTERVALS = [15, 30, 60, 180, 360, 720, 1440] as const;

export class UpdateCronIntervalDto {
  @IsInt()
  @IsIn(ALLOWED_INTERVALS)
  intervalMinutes: number;
}

