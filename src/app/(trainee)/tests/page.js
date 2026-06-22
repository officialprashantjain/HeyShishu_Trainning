'use client'

import TraineeLayout from '@/components/common/TraineeLayout'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { MdAssignment, MdCheckCircle } from 'react-icons/md'
import Link from 'next/link'

const dummyTests = [
  { id: 't1', module: 'Child Development Basics - Module 1', score: '90%', passed: true, date: '2 days ago' },
  { id: 't2', module: 'Nutrition & Safe Feeding - Module 1', score: '85%', passed: true, date: 'Yesterday' },
  { id: 't3', module: 'First Aid & Emergency Response - Module 1', score: '-', passed: false, pending: true },
]

export default function TestsPage() {
  return (
    <TraineeLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
            <MdAssignment size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">My Tests</h1>
            <p className="text-sm text-neutral-500">View your MCQ test results and pending assessments.</p>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100 text-xs uppercase tracking-widest font-semibold text-neutral-500">
                  <th className="p-4">Module Name</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {dummyTests.map((test) => (
                  <tr key={test.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 font-semibold text-neutral-800 text-sm">
                      {test.module}
                    </td>
                    <td className="p-4">
                      {test.pending ? (
                        <Badge variant="yellow" dot>Pending</Badge>
                      ) : test.passed ? (
                        <Badge variant="green" dot>Passed</Badge>
                      ) : (
                        <Badge variant="red" dot>Failed</Badge>
                      )}
                    </td>
                    <td className="p-4 font-mono font-bold text-neutral-600">
                      {test.score}
                    </td>
                    <td className="p-4 text-sm text-neutral-500">
                      {test.pending ? '-' : test.date}
                    </td>
                    <td className="p-4 text-right">
                      {test.pending ? (
                        <Link href="/courses/c1/modules/m1/test">
                          <Button variant="primary" size="sm">Take Test</Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="sm">Review</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </TraineeLayout>
  )
}
