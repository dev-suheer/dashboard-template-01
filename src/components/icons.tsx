import { Icon as Iconify } from "@iconify/react";
import bell from "@iconify-icons/lucide/bell";
import calendar from "@iconify-icons/lucide/calendar";
import chartLine from "@iconify-icons/lucide/chart-line";
import check from "@iconify-icons/lucide/check";
import chevronDown from "@iconify-icons/lucide/chevron-down";
import circleHelp from "@iconify-icons/lucide/circle-help";
import clock from "@iconify-icons/lucide/clock";
import download from "@iconify-icons/lucide/download";
import layoutGrid from "@iconify-icons/lucide/layout-grid";
import mail from "@iconify-icons/lucide/mail";
import menu from "@iconify-icons/lucide/menu";
import moon from "@iconify-icons/lucide/moon";
import panelLeft from "@iconify-icons/lucide/panel-left";
import phone from "@iconify-icons/lucide/phone";
import plus from "@iconify-icons/lucide/plus";
import reply from "@iconify-icons/lucide/reply";
import search from "@iconify-icons/lucide/search";
import settings from "@iconify-icons/lucide/settings";
import ship from "@iconify-icons/lucide/ship";
import sun from "@iconify-icons/lucide/sun";
import target from "@iconify-icons/lucide/target";
import users from "@iconify-icons/lucide/users";
import wallet from "@iconify-icons/lucide/wallet";
import waves from "@iconify-icons/lucide/waves";
import x from "@iconify-icons/lucide/x";
import { cn } from "@/lib/cn";

export type IconName =
  | "mark"
  | "overview"
  | "crew"
  | "clock"
  | "wallet"
  | "target"
  | "chart"
  | "help"
  | "search"
  | "bell"
  | "plus"
  | "sun"
  | "moon"
  | "download"
  | "check"
  | "close"
  | "chevron"
  | "menu"
  | "ship"
  | "panel"
  | "mail"
  | "phone"
  | "calendar"
  | "settings"
  | "reply";

const icons = {
  mark: waves,
  overview: layoutGrid,
  crew: users,
  clock,
  wallet,
  target,
  chart: chartLine,
  help: circleHelp,
  search,
  bell,
  plus,
  sun,
  moon,
  download,
  check,
  close: x,
  chevron: chevronDown,
  menu,
  ship,
  panel: panelLeft,
  mail,
  phone,
  calendar,
  settings,
  reply,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return <Iconify icon={icons[name]} className={cn("size-[18px] shrink-0", className)} />;
}
