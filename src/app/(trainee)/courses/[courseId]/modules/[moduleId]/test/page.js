'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import TraineeLayout from '@/components/common/TraineeLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { MdArrowBack, MdAccessTime, MdAssignment, MdCheckCircle, MdSend } from 'react-icons/md'
import { courseService } from '@/services/courseService'
import { showToast } from '@/utils/toast'

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds || 0)
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, '0')
  const secs = String(safeSeconds % 60).padStart(2, '0')
  return `${minutes}:${secs}`
}

export default function TestPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params?.courseId
  const moduleId = params?.moduleId

  const [moduleData, setModuleData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)

  useEffect(() => {
    const fetchModule = async () => {
      try {
        if (!courseId || !moduleId) return

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

    fetchModule()
  }, [courseId, moduleId])

  useEffect(() => {
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
  }, [moduleData, timeRemaining, isSubmitting, submissionResult])

  useEffect(() => {
    if (timeRemaining === 0 && moduleData?.test && !isSubmitting && !submissionResult) {
      handleSubmitTest(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining])

  const test = moduleData?.test
  const questions = useMemo(() => test?.questions || [], [test])
  const currentQuestion = questions[currentQuestionIndex]
  const currentSelectedIndex = currentQuestion ? selectedAnswers[currentQuestion._id] : undefined
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleAnswerSelect = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

  async function handleSubmitTest(isAutoSubmit = false) {
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

      if (answers.length === 0 && !isAutoSubmit) {
        showToast.error('Please answer at least one question before submitting.')
        setIsSubmitting(false)
        return
      }

      const response = await courseService.submitModuleTest(moduleId, {
        courseId,
        answers,
      })

      setSubmissionResult(response)

      const score = response?.score ?? response?.percentage ?? response?.data?.score
      const passed = response?.passed ?? response?.isPassed ?? response?.data?.passed

      if (passed === true) {
        showToast.success(score != null ? `Test submitted successfully. Score: ${score}` : 'Test submitted successfully.')
      } else if (passed === false) {
        showToast.success(score != null ? `Test submitted. Score: ${score}` : 'Test submitted.')
      } else {
        showToast.success('Test submitted successfully.')
      }
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

  if (!moduleData || !test) {
    return (
      <TraineeLayout>
        <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold text-neutral-900">Test not available</h1>
          <p className="text-neutral-500">
            This module does not have a test attached yet.
          </p>
          <Link href={`/courses/${courseId}`}>
            <Button variant="primary">Back to Module</Button>
          </Link>
        </div>
      </TraineeLayout>
    )
  }

  const headerLabel = test?.title || moduleData?.title || 'Module Test'
  const totalQuestions = questions.length
  const answeredCount = Object.keys(selectedAnswers).length

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
            <Badge variant="blue" dot>{answeredCount}/{totalQuestions} Answered</Badge>
            <div className="text-lg font-mono font-bold text-danger-500 bg-white px-3 py-1.5 rounded-lg border border-danger-100 shadow-sm flex items-center gap-2">
              <MdAccessTime size={18} />
              {formatTime(timeRemaining)}
            </div>
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
                  Type: {currentQuestion?.type || 'mcq'} • Marks: {currentQuestion?.marks ?? 0}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {(currentQuestion?.options || []).map((option, index) => {
                const isSelected = currentSelectedIndex === index

                return (
                  <label
                    key={option._id || `${currentQuestion?._id}-${index}`}
                    className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:bg-neutral-50 hover:border-primary-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQuestion?._id}
                      className="w-5 h-5 text-primary-500"
                      checked={isSelected}
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

            <div className="flex items-center gap-3">
              {!isLastQuestion ? (
                <Button
                  variant="primary"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  disabled={isSubmitting}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => handleSubmitTest(false)}
                  disabled={isSubmitting}
                  iconRight={<MdSend />}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Test'}
                </Button>
              )}
            </div>
          </Card.Footer>
        </Card>

        <Card padding="md" className="bg-neutral-50">
          <div className="flex items-center gap-3">
            <MdAssignment className="text-primary-600" size={20} />
            <div>
              <p className="text-sm font-semibold text-neutral-800">{moduleData.title}</p>
              <p className="text-xs text-neutral-500">
                Passing score: {test.passingScore}% • Max attempts: {test.maxAttempts} • Time limit: {test.timeLimitMinutes} minutes
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-start">
          <Link href={`/courses/${courseId}/modules/${moduleId}`}>
            <Button variant="ghost" icon={<MdArrowBack />}>
              Back to Module
            </Button>
          </Link>
        </div>
      </div>
    </TraineeLayout>
  )
}
