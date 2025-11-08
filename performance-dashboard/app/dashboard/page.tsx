import { generateInitialDataset } from '../../lib/dataGenerator'
import dynamic from 'next/dynamic'

const DashboardShell = dynamic(() => import('../../components/dashboard/DashboardShell'), { ssr: false })

export default async function DashboardPage() {
  const initialData = generateInitialDataset(10000)

  return <DashboardShell initialData={initialData} />
}
