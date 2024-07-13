import {
  ClockIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
  EllipsisHorizontalCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  MinusCircleIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline"

export type Status = {
  value: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export type Priority = {
  value: number
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export const statuses: Status[] = [
  {
    value: "new",
    label: "New",
    icon: ExclamationCircleIcon,
  },
  {
    value: "todo",
    label: "Todo",
    icon: EllipsisHorizontalCircleIcon,
  },
  {
    value: "working",
    label: "In Progress",
    icon: ClockIcon,
  },
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircleIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: MinusCircleIcon,
  },
  {
    value: "shipped",
    label: "Shipped",
    icon: CheckCircleIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: XCircleIcon,
  },
]

export const priorities: Priority[] = [
  {
    value: 1,
    label: "High",
    icon: ArrowUpIcon,
  },
  {
    value: 2,
    label: "Medium",
    icon: ArrowRightIcon,
  },
  {
    value: 3,
    label: "Low",
    icon: ArrowDownIcon,
  },
]

export const tagColors = [
  {
    primaryColor: "#b91c1c", // red-700
    secondaryColor: "#fee2e2", // red-100
  },
  {
    primaryColor: "#c2410c", // orange-700
    secondaryColor: "#ffedd5", // orange-100
  },
  {
    primaryColor: "#a16207", // yellow-700
    secondaryColor: "#fef9c3", // yellow-100
  },
  {
    primaryColor: "#4d7c0f", // lime-700
    secondaryColor: "#ecfccb", // lime-100
  },
  {
    primaryColor: "#047857", // emerald-700
    secondaryColor: "#d1fae5", // emerald-100
  },
  {
    primaryColor: "#0369a1", // sky-700
    secondaryColor: "#e0f2fe", // sky-100
  },
  {
    primaryColor: "#1d4ed8", // blue-700
    secondaryColor: "#dbeafe", // blue-100
  },
  {
    primaryColor: "#4338ca", // indigo-700
    secondaryColor: "#e0e7ff", // indigo-100
  },
  {
    primaryColor: "#7e22ce", // purple-700
    secondaryColor: "#f3e8ff", // purple-100
  },
  {
    primaryColor: "#a21caf", // fuchsia-700
    secondaryColor: "#fae8ff", // fuchsia-100
  },
  {
    primaryColor: "#be185d", // pink-700
    secondaryColor: "#fce7f3", // pink-100
  },
  {
    primaryColor: "#be123c", // rose-700
    secondaryColor: "#ffe4e6", // rose-100
  },
]
