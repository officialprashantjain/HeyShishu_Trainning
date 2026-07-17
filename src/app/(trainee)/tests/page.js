'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import TraineeLayout from '@/components/common/TraineeLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import {
  MdAccessTime,
  MdArrowBack,
  MdAssignment,
  MdCheckCircle,
  MdLock,
  MdMenuBook,
  MdRateReview,
  MdSend,
} from 'react-icons/md'
import { courseService } from '@/services/courseService'
import { showToast } from '@/utils/toast'

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds || 0)
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, '0')
  const secs = String(safeSeconds % 60).padStart(2, '0')
  return `${minutes}:${secs}`
}

function asArray(value) {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  return []
}

function pickCourseList(data) {
  return asArray(
    data?.courses ||
    data?.data?.courses ||
    data?.payload?.courses ||
    data
  )
}

function pickCourse(data) {
  return data?.course || data?.data?.course || data
}

function pickModules(course) {
  return asArray(
    course?.modules ||
    course?.course?.modules ||
    course?.data?.modules ||
    []
  )
}

function getId(item) {
  return item?._id || item?.id
}

function findModuleProgress(course, moduleId) {
  const progressItems = asArray(
    course?.myProgress?.moduleProgress ||
    course?.progress?.moduleProgress ||
    course?.moduleProgress ||
    []
  )

  return progressItems.find((item) => {
    const progressModuleId =
      item?.moduleId?._id ||
      item?.moduleId ||
      item?.module?._id ||
      item?.module ||
      item?._id

    return String(progressModuleId) === String(moduleId)
  })
}

function getProgressPercent(moduleData, moduleProgress) {
  return (
    moduleData?.myModuleProgress?.progressPercentage ??
    moduleData?.progressPercentage ??
    moduleProgress?.progressPercentage ??
    moduleProgress?.percentage ??
    0
  )
}

function isModuleCompleted(moduleData, moduleProgress) {
  return Boolean(
    moduleData?.myModuleProgress?.isCompleted ||
    moduleData?.isCompleted ||
    moduleData?.completed ||
    moduleProgress?.isCompleted ||
    moduleProgress?.completed ||
    getProgressPercent(moduleData, moduleProgress) >= 100
  )
}

function isTestCompleted(moduleData, moduleProgress) {
  return Boolean(
    moduleData?.myModuleProgress?.isTestCompleted ||
    moduleData?.myModuleProgress?.testCompleted ||
    moduleData?.myModuleProgress?.isPassed ||
    moduleData?.testResult ||
    moduleData?.testSubmission ||
    moduleData?.testCompleted ||
    moduleData?.isTestCompleted ||
    moduleProgress?.isTestCompleted ||
    moduleProgress?.testCompleted ||
    moduleProgress?.isPassed ||
    moduleProgress?.testResult ||
    moduleProgress?.testSubmission
  )
}

function TestsPageContent() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get('courseId')
  const moduleId = searchParams.get('moduleId')
  const mode = searchParams.get('mode')
  const isRunnerMode = Boolean(courseId && moduleId)

  const [testItems, setTestItems] = useState([])
  const [moduleData, setModuleData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)
  const [cycleStatus, setCycleStatus] = useState(null)
  const [isRequestingReview, setIsRequestingReview] = useState(false)

  useEffect(() => {
    const fetchTestList = async () => {
      try {
        const data = await courseService.getAllCourses()
        setCycleStatus(data?.cycleStatus || data?.data?.cycleStatus || 'training_in_progress')
        const courses = pickCourseList(data)

        const detailedCourses = await Promise.all(
          courses.map(async (course) => {
            const currentCourseId = getId(course)
            if (!currentCourseId) return null

            try {
              const details = await courseService.getCourseDetails(currentCourseId)
              return {
                ...course,
                ...pickCourse(details),
              }
            } catch {
              return course
            }
          })
        )

        const moduleItems = detailedCourses
          .filter(Boolean)
          .flatMap((course) => {
            const currentCourseId = getId(course)
            const courseTitle = course?.title || course?.name || 'Course'

            return pickModules(course).map((moduleItem, index) => ({
              course,
              courseId: currentCourseId,
              courseTitle,
              moduleId: getId(moduleItem),
              moduleOrder: moduleItem?.order || index + 1,
              moduleTitle: moduleItem?.title || `Module ${index + 1}`,
              moduleSummary: moduleItem?.summary || moduleItem?.description,
              moduleProgress: findModuleProgress(course, getId(moduleItem)),
            }))
          })
          .filter((item) => item.courseId && item.moduleId)

        const itemsWithTests = await Promise.all(
          moduleItems.map(async (item) => {
            try {
              const details = await courseService.getModuleDetails(item.courseId, item.moduleId)
              const fullModule = details?.module || details?.data?.module || details
              const progressPercent = getProgressPercent(fullModule, item.moduleProgress)
              const moduleCompleted = isModuleCompleted(fullModule, item.moduleProgress)
              const testCompleted = isTestCompleted(fullModule, item.moduleProgress)
              const testScore = fullModule?.myModuleProgress?.testScore
              const testPassed = fullModule?.myModuleProgress?.testPassed
              const testAttemptCount = fullModule?.myModuleProgress?.testAttemptCount || 0

              return {
                ...item,
                moduleTitle: fullModule?.title || item.moduleTitle,
                moduleSummary: fullModule?.summary || item.moduleSummary,
                test: fullModule?.test,
                progressPercent,
                moduleCompleted,
                testCompleted,
                testScore,
                testPassed,
                testAttemptCount,
              }
            } catch {
              return {
                ...item,
                test: null,
                progressPercent: getProgressPercent(null, item.moduleProgress),
                moduleCompleted: isModuleCompleted(null, item.moduleProgress),
                testCompleted: isTestCompleted(null, item.moduleProgress),
                testScore: undefined,
                testPassed: undefined,
                testAttemptCount: 0,
              }
            }
          })
        )

        setTestItems(itemsWithTests.filter((item) => item.test))
      } catch (error) {
        showToast.error(`Failed to load tests: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    const fetchSelectedModule = async () => {
      try {
        const data = await courseService.getModuleDetails(courseId, moduleId)
        const normalizedModule = data?.module || data?.data?.module || data

        setModuleData(normalizedModule)
        setCurrentQuestionIndex(0)
        setSelectedAnswers({})
        setSubmissionResult(null)
        setTimeRemaining((normalizedModule?.test?.timeLimitMinutes || 0) * 60)
      } catch (error) {
        showToast.error(`Error loading test: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    if (isRunnerMode) {
      fetchSelectedModule()
    } else {
      fetchTestList()
    }
  }, [courseId, moduleId, isRunnerMode])

  useEffect(() => {
    if (!isRunnerMode || mode === 'review') return
    if (!moduleData?.test?.timeLimitMinutes || isSubmitting || submissionResult) return
    if (timeRemaining <= 0) return

    const timer = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isRunnerMode, mode, moduleData, timeRemaining, isSubmitting, submissionResult])

  const test = moduleData?.test
  const questions = useMemo(() => test?.questions || [], [test])
  const currentQuestion = questions[currentQuestionIndex]
  const currentSelectedIndex = currentQuestion ? selectedAnswers[currentQuestion._id] : undefined
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const answeredCount = Object.keys(selectedAnswers).length

  const handleAnswerSelect = (questionId, optionIndex) => {
    if (mode === 'review' || submissionResult) return

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

  const handleRequestReview = async () => {
    try {
      setIsRequestingReview(true)
      const res = await courseService.requestReview()
      const newStatus = res?.data?.cycleStatus || res?.cycleStatus || 'review_requested'
      setCycleStatus(newStatus)
      showToast.success(res?.message || 'Review request submitted successfully.')
    } catch (error) {
      showToast.error(`Failed to request review: ${error.message}`)
    } finally {
      setIsRequestingReview(false)
    }
  }

  const handleSubmitTest = async () => {
    if (!courseId || !moduleId || !test || isSubmitting || submissionResult) return

    setIsSubmitting(true)

    try {
      const answers = questions
        .map((question) => {
          const selectedOptionIndex = selectedAnswers[question._id]
          if (selectedOptionIndex === undefined || selectedOptionIndex === null) {
            return null
          }

          return {
            questionId: question._id,
            selectedOptionIndex,
          }
        })
        .filter(Boolean)

      if (answers.length === 0) {
        showToast.error('Please answer at least one question before submitting.')
        setIsSubmitting(false)
        return
      }

      const response = await courseService.submitModuleTest(moduleId, {
        courseId,
        answers,
      })

      setSubmissionResult(response)
      showToast.success(response?.message || 'Test submitted successfully.')
    } catch (error) {
      showToast.error(`Failed to submit test: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <TraineeLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      </TraineeLayout>
    )
  }

  if (!isRunnerMode) {
    const availableCount = testItems.filter((item) => item.moduleCompleted && !item.testCompleted).length
    const completedCount = testItems.filter((item) => item.testCompleted).length

    return (
      <TraineeLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">My Tests</h1>
              <p className="text-sm text-neutral-500 mt-1">
                Complete module videos to unlock tests, then submit or review your attempts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="blue" dot>{availableCount} Ready</Badge>
                <Badge variant="green" dot>{completedCount} Completed</Badge>
                <Badge variant="gray" dot>{testItems.length} Total</Badge>
              </div>

              {cycleStatus && cycleStatus !== 'training_in_progress' && (
                <div className="ml-0 sm:ml-4 border-t sm:border-t-0 sm:border-l border-neutral-200 pt-3 sm:pt-0 sm:pl-4">
                  {cycleStatus === 'training_completed' ? (
                    <Button 
                      variant="primary" 
                      onClick={handleRequestReview} 
                      disabled={isRequestingReview}
                    >
                      {isRequestingReview ? 'Requesting...' : 'Request for Review'}
                    </Button>
                  ) : cycleStatus === 'review_requested' ? (
                    <Button variant="ghost" disabled className="bg-neutral-100 text-neutral-500 border border-neutral-200">
                      Review Requested ✓
                    </Button>
                  ) : (
                    <Button variant="ghost" disabled className="bg-neutral-100 text-neutral-500 border border-neutral-200">
                      Counselor Assigned ✓
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {testItems.length === 0 ? (
            <Card padding="lg" className="text-center bg-white">
              <h3 className="text-lg font-semibold text-neutral-700">No Tests Available Yet</h3>
              <p className="text-neutral-500 text-sm mt-1">
                Tests will appear here once your assigned modules include backend test data.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {testItems.map((item) => {
                const isLocked = !item.moduleCompleted
                const maxAttempts = item.test?.maxAttempts
                const hasReachedMaxAttempts = maxAttempts && item.testAttemptCount >= maxAttempts
                const actionLabel = hasReachedMaxAttempts ? 'Review Results' : item.testCompleted ? 'Review Test' : 'Take Test'
                const actionHref = `/tests?courseId=${item.courseId}&moduleId=${item.moduleId}${hasReachedMaxAttempts || item.testCompleted ? '&mode=review' : ''}`
                const status = hasReachedMaxAttempts
                  ? { label: 'Max Attempts', variant: 'danger' }
                  : item.testCompleted
                  ? { label: 'Test Done', variant: 'green' }
                  : item.moduleCompleted
                  ? { label: 'Ready', variant: 'blue' }
                  : { label: 'Locked', variant: 'gray' }

                return (
                  <Card key={`${item.courseId}-${item.moduleId}`} className="transition-all duration-200 hover:border-primary-300 hover:shadow-card-md">
                    <div className="p-4 flex flex-col lg:flex-row lg:items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          item.testCompleted
                            ? 'bg-success-100 text-success-600'
                            : item.moduleCompleted
                            ? 'bg-primary-100 text-primary-600'
                            : 'bg-neutral-100 text-neutral-400'
                        }`}
                      >
                        {item.testCompleted ? <MdCheckCircle size={22} /> : isLocked ? <MdLock size={20} /> : <MdAssignment size={22} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="text-xs font-bold text-neutral-400">Module {item.moduleOrder}</p>
                          <Badge variant={status.variant} dot>{status.label}</Badge>
                        </div>
                        <h3 className="font-bold text-neutral-900 truncate" title={item.test?.title || item.moduleTitle}>
                          {item.test?.title || item.moduleTitle}
                        </h3>
                        <p className="text-sm text-neutral-500 truncate mt-0.5" title={item.courseTitle}>
                          {item.courseTitle} - {item.moduleTitle}
                        </p>
                      </div>

                      <div className="w-full lg:w-52">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-neutral-600">Module Progress</span>
                          <span className="font-bold text-neutral-800">{item.progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.moduleCompleted ? 'bg-success-500' : 'bg-primary-500'}`}
                            style={{ width: `${Math.min(100, item.progressPercent)}%` }}
                          />
                        </div>
                        {item.testAttemptCount > 0 && item.testScore !== undefined && (
                          <div className="flex justify-between text-xs mt-2 mb-1">
                            <span className="font-medium text-neutral-600">Test Score</span>
                            <span className={`font-bold ${item.testPassed ? 'text-success-600' : 'text-danger-600'}`}>
                              {item.testScore}%
                            </span>
                          </div>
                        )}
                        {item.testAttemptCount > 0 && item.testScore !== undefined && (
                          <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.testPassed ? 'bg-success-500' : 'bg-danger-500'}`}
                              style={{ width: `${Math.min(100, item.testScore)}%` }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 lg:items-end">
                        <Link href={`/courses/${item.courseId}/modules/${item.moduleId}`}>
                          <Button variant="outline" size="sm" icon={<MdMenuBook />}>
                            Module
                          </Button>
                        </Link>

                        {isLocked ? (
                          <Button variant="ghost" size="sm" disabled icon={<MdLock />}>
                            Complete Module
                          </Button>
                        ) : (
                          <Link href={actionHref}>
                            <Button variant={item.testCompleted ? 'outline' : 'primary'} size="sm" icon={item.testCompleted ? <MdRateReview /> : <MdAssignment />}>
                              {actionLabel}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </TraineeLayout>
    )
  }

  if (!moduleData || !test) {
    return (
      <TraineeLayout>
        <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold text-neutral-900">Test not available</h1>
          <p className="text-neutral-500">
            The backend did not return a test for this module.
          </p>
          <Link href={`/courses/${courseId}/modules/${moduleId}`}>
            <Button variant="primary">Back to Module</Button>
          </Link>
        </div>
      </TraineeLayout>
    )
  }

  const headerLabel = test?.title || moduleData?.title || 'Module Test'
  const totalQuestions = questions.length
  const isReviewMode = mode === 'review'

  return (
    <TraineeLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-primary-50 p-4 border border-primary-100 rounded-xl">
          <div>
            <h1 className="font-bold text-primary-900">{headerLabel}</h1>
            <p className="text-xs text-primary-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isReviewMode ? 'green' : 'blue'} dot>
              {isReviewMode ? 'Review Mode' : `${answeredCount}/${totalQuestions} Answered`}
            </Badge>
            {!isReviewMode && (
              <div className="text-lg font-mono font-bold text-danger-500 bg-white px-3 py-1.5 rounded-lg border border-danger-100 shadow-sm flex items-center gap-2">
                <MdAccessTime size={18} />
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        </div>

        {submissionResult && (
          <Card className="border-success-200 bg-success-50">
            <Card.Body className="flex items-start gap-3">
              <MdCheckCircle size={22} className="text-success-600 mt-0.5" />
              <div>
                <h2 className="font-bold text-success-800">Test submitted</h2>
                <p className="text-sm text-success-700 mt-1">
                  {submissionResult?.message || 'Your answers were sent to the backend successfully.'}
                </p>
                {(submissionResult?.score != null || submissionResult?.percentage != null) && (
                  <p className="text-sm text-success-700 mt-1 font-semibold">
                    Score: {submissionResult.score ?? submissionResult.percentage}
                  </p>
                )}
              </div>
            </Card.Body>
          </Card>
        )}

        <Card>
          <Card.Body>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <Badge variant="gray" className="mb-3">
                  {test?.title || 'Module Test'}
                </Badge>
                <h2 className="text-lg font-bold text-neutral-900 mb-2">
                  {currentQuestion?.questionText}
                </h2>
                <p className="text-xs text-neutral-500">
                  Type: {currentQuestion?.type || 'mcq'} - Marks: {currentQuestion?.marks ?? 0}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {(currentQuestion?.options || []).map((option, index) => {
                const isSelected = currentSelectedIndex === index

                return (
                  <label
                    key={option._id || `${currentQuestion?._id}-${index}`}
                    className={`flex items-center gap-3 p-4 border rounded-xl transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : isReviewMode
                        ? 'border-neutral-200 bg-white'
                        : 'border-neutral-200 hover:bg-neutral-50 hover:border-primary-300 cursor-pointer'
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQuestion?._id}
                      className="w-5 h-5 text-primary-500"
                      checked={isSelected}
                      disabled={isReviewMode || Boolean(submissionResult)}
                      onChange={() => handleAnswerSelect(currentQuestion._id, index)}
                    />
                    <span className="text-neutral-700 font-medium">{option.text}</span>
                  </label>
                )
              })}
            </div>
          </Card.Body>

          <Card.Footer className="flex justify-between items-center bg-neutral-50/50 gap-3">
            <Button
              variant="ghost"
              disabled={currentQuestionIndex === 0 || isSubmitting}
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            >
              Previous
            </Button>

            {!isLastQuestion ? (
              <Button
                variant="primary"
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                disabled={isSubmitting}
              >
                Next Question
              </Button>
            ) : isReviewMode || submissionResult ? (
              <Link href="/tests">
                <Button variant="primary">Back to Tests</Button>
              </Link>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                iconRight={<MdSend />}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </Button>
            )}
          </Card.Footer>
        </Card>

        <Card padding="md" className="bg-neutral-50">
          <div className="flex items-center gap-3">
            <MdAssignment className="text-primary-600" size={20} />
            <div>
              <p className="text-sm font-semibold text-neutral-800">{moduleData.title}</p>
              <p className="text-xs text-neutral-500">
                Passing score: {test.passingScore}% - Max attempts: {test.maxAttempts} - Time limit: {test.timeLimitMinutes} minutes
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-start gap-2">
          <Link href="/tests">
            <Button variant="ghost" icon={<MdArrowBack />}>
              Back to Tests
            </Button>
          </Link>
          <Link href={`/courses/${courseId}/modules/${moduleId}`}>
            <Button variant="outline" icon={<MdMenuBook />}>
              Module
            </Button>
          </Link>
        </div>
      </div>
    </TraineeLayout>
  )
}

export default function TestsPage() {
  return (
    <Suspense
      fallback={
        <TraineeLayout>
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        </TraineeLayout>
      }
    >
      <TestsPageContent />
    </Suspense>
  )
}
