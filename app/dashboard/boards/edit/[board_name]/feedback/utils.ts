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
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircleIcon,
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
    value: "done",
    label: "Done",
    icon: MinusCircleIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: XCircleIcon,
  },
  {
    value: "new",
    label: "New",
    icon: ExclamationCircleIcon,
  },
  {
    value: "shipped",
    label: "Shipped",
    icon: CheckCircleIcon,
  },
]

export const priorities: Priority[] = [
  {
    value: 3,
    label: "Low",
    icon: ArrowDownIcon,
  },
  {
    value: 2,
    label: "Medium",
    icon: ArrowRightIcon,
  },
  {
    value: 1,
    label: "High",
    icon: ArrowUpIcon,
  },
]
