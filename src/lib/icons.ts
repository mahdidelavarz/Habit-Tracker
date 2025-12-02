import {
  Activity,
  Apple,
  BookOpen,
  Briefcase,
  CalendarCheck,
  Camera,
  CheckCircle2,
  Coffee,
  Dumbbell,
  Feather,
  Flame,
  HeartPulse,
  Hourglass,
  Music,
  PenSquare,
  Sun,
  Target,
  Timer,
  Trophy,
  UtensilsCrossed,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export const HABIT_ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  apple: Apple,
  book: BookOpen,
  work: Briefcase,
  calendar: CalendarCheck,
  camera: Camera,
  check: CheckCircle2,
  coffee: Coffee,
  workout: Dumbbell,
  write: PenSquare,
  meditate: Feather,
  flame: Flame,
  health: HeartPulse,
  hourglass: Hourglass,
  music: Music,
  sun: Sun,
  target: Target,
  timer: Timer,
  trophy: Trophy,
  food: UtensilsCrossed,
};

export const HABIT_ICON_OPTIONS = Object.keys(HABIT_ICONS).map((key) => ({
  value: key,
  Icon: HABIT_ICONS[key],
}));

