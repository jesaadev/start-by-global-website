import { DashboardLayout } from "@/components/dashboard-layout"
import { InsightsContent } from "./insights-content"

export const metadata = {
  title: "Insights & Blog | Start By Global",
  description: "Tendencias, estrategias y análisis del mundo digital. Marketing, desarrollo web y tecnología para impulsar tu negocio.",
}

export default function InsightsPage() {
  return (
    <DashboardLayout>
      <InsightsContent />
    </DashboardLayout>
  )
}
