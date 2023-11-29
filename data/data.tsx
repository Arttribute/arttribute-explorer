import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "in progress",
    label: "Pending",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Accepted",
    icon: CheckCircledIcon,
  },
  {
    value: "canceled",
    label: "Denied",
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    label: "Art Place",
    value: "low",
  },
  {
    label: "Arttribute Studio",
    value: "medium",
  },
  {
    label: "Vokali",
    value: "high",
  },
];
