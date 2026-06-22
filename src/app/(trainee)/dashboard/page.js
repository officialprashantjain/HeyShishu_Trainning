'use client'

import TraineeLayout from '@/components/common/TraineeLayout'
import Card from '@/components/ui/Card'
import Badge, { statusVariant, statusLabel } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import {
  MdMenuBook,
  MdCheckCircle,
  MdAccessTime,
  MdTrendingUp,
  MdArrowForward,
  MdLock,
  MdPlayCircle,
} from 'react-icons/md'
import { FaGraduationCap } from 'react-icons/fa'

// ── Dummy data for layout testing ──────────────────────────
const dummyUser = {
  fullName: 'Priya Sharma',
  email:    'priya@example.com',
  status:   'training_in_progress',
  role:     'Nanny',
}

const stats = [
  {
    label:  'Total Courses',
    value:  '4',
    change: 'Assigned to you',
    icon:   <MdMenuBook size={20} />,
    color:  'bg-primary-500/10 text-primary-600',
  },
  {
    label:  'Completed',
    value:  '1',
    change: '25% done',
    icon:   <MdCheckCircle size={20} />,
    color:  'bg-success-50 text-success-600',
  },
  {
    label:  'In Progress',
    value:  '2',
    change: 'Keep going!',
    icon:   <MdPlayCircle size={20} />,
    color:  'bg-info-50 text-info-600',
  },
  {
    label:  'Time Spent',
    value:  '6h 30m',
    change: 'This week',
    icon:   <MdAccessTime size={20} />,
    color:  'bg-warning-50 text-warning-600',
  },
]

const courses = [
  {
    id:         'c1',
    title:      'Child Development Basics',
    modules:    8,
    completed:  8,
    status:     'completed',
  },
  {
    id:         'c2',
    title:      'Nutrition & Feeding for Infants',
    modules:    6,
    completed:  3,
    status:     'in_progress',
  },
  {
    id:         'c3',
    title:      'Safety & First Aid for Nannies',
    modules:    5,
    completed:  0,
    status:     'locked',
  },
  {
    id:         'c4',
    title:      'Communication with Parents',
    modules:    4,
    completed:  0,
    status:     'locked',
  },
]

const courseStatusBadge = {
  completed:   { variant: 'green',  label: 'Completed' },
  in_progress: { variant: 'blue',   label: 'In Progress' },
  locked:      { variant: 'gray',   label: 'Locked' },
}

export default function DashboardPage() {
  const overallPct = Math.round(
    courses.reduce((sum, c) => sum + c.completed, 0) /
    courses.reduce((sum, c) => sum + c.modules, 0) *
    100
  )

  return (
    <TraineeLayout user={dummyUser}>

      {/* ── Page header ───────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900">
          Welcome back, {dummyUser.fullName.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Heres an overview of your training progress.
        </p>
      </div>

      {/* ── Status banner ─────────────────────────────────── */}
      <Card padding="md" className="mb-6 bg-gradient-to-r from-dark-900 to-dark-800 border-0 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 bg-primary-500/20 rounded-2xl flex items-center
                          justify-center text-primary-400 flex-shrink-0">
            <FaGraduationCap size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-white text-base font-semibold">
                Your Training is In Progress
              </h2>
              <Badge variant={statusVariant[dummyUser.status]} dot className="text-xs">
                {statusLabel[dummyUser.status]}
              </Badge>
            </div>
            <p className="text-neutral-400 text-sm">
              Complete all courses and pass every module test to move to counselor review.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-3xl font-bold text-primary-400">{overallPct}%</span>
            <span className="text-xs text-neutral-400">Overall Progress</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 bg-white/10 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label} padding="md" className="flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{s.value}</p>
              <p className="text-sm font-medium text-neutral-600 leading-tight">{s.label}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{s.change}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Course list ───────────────────────────────────── */}
      <Card padding="none">
        <Card.Header className="px-5 pt-5">
          <div>
            <Card.Title>My Courses</Card.Title>
            <p className="text-xs text-neutral-400 mt-0.5">
              Complete all modules in order to advance
            </p>
          </div>
          <Button variant="ghost" size="sm" iconRight={<MdArrowForward />}>
            View All
          </Button>
        </Card.Header>

        <div className="border-t border-neutral-200 my-4 mx-5 mt-0" />

        <div className="divide-y divide-neutral-100">
          {courses.map((course, idx) => {
            const pct = Math.round(course.completed / course.modules * 100)
            const badge = courseStatusBadge[course.status]
            const isLocked = course.status === 'locked'

            return (
              <div key={course.id} className="flex items-center gap-4 px-5 py-4">
                {/* Step number */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center
                              text-sm font-bold flex-shrink-0 border-2
                              ${course.status === 'completed'
                                ? 'bg-success-500 border-success-500 text-white'
                                : course.status === 'in_progress'
                                ? 'bg-primary-500 border-primary-500 text-white'
                                : 'bg-neutral-100 border-neutral-200 text-neutral-400'}`}
                >
                  {course.status === 'completed'
                    ? <MdCheckCircle size={16} />
                    : isLocked
                    ? <MdLock size={14} />
                    : idx + 1}
                </div>

                {/* Course info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-sm font-semibold truncate
                                  ${isLocked ? 'text-neutral-400' : 'text-neutral-800'}`}>
                      {course.title}
                    </p>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Mini progress bar */}
                    <div className="flex-1 bg-neutral-100 rounded-full h-1.5 max-w-xs">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500
                                    ${course.status === 'completed'
                                      ? 'bg-success-500'
                                      : 'bg-primary-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-neutral-400 flex-shrink-0">
                      {course.completed}/{course.modules} modules
                    </span>
                  </div>
                </div>

                {/* CTA */}
                {!isLocked && (
                  <Button
                    variant={course.status === 'completed' ? 'outline' : 'primary'}
                    size="sm"
                  >
                    {course.status === 'completed' ? 'Review' : 'Continue'}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* ── Bottom row: tip card ──────────────────────────── */}
      <div className="mt-4">
        <Card padding="md" className="bg-gradient-to-br from-primary-50 to-accent-400/5 border-primary-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center
                            justify-center text-primary-600 flex-shrink-0">
              <MdTrendingUp size={22} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-800 mb-1">
                Complete your profile to speed up approval
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Trainees with complete profiles and all module tests passed get reviewed
                up to 2× faster by counselors.
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Update Profile
              </Button>
            </div>
          </div>
        </Card>
      </div>

    </TraineeLayout>
  )
}
