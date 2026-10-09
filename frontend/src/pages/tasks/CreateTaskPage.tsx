import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { PageHeader } from '../../components/PageHeader'
import { TaskForm } from '../../components/tasks/TaskForm'
import { Alert } from '../../components/ui/Alert'
import { useCreateTask } from '../../tasks/useCreateTask'
import type {
    Task,
    TaskField,
    TaskFieldErrors, TaskFormHandle,
    TaskFormValues
} from "../../types/task";
import { toFirstFieldErrors } from '../../utils/api/fieldErrors'
import { ROUTES } from '../../utils/constants/app'
import { INITIAL_TASK_FORM_VALUES, TASK_FIELDS } from '../../utils/constants/task'
import { toCreateTaskPayload } from '../../utils/taskPayload'
import {
  findFirstInvalidField,
  hasValidationErrors,
} from '../../utils/validation/common'
import { validateTaskForm } from '../../utils/validation/task'

const CreateTaskPage = () => {
  const navigate = useNavigate()
  const { createTask, isCreating } = useCreateTask()
  const formRef = useRef<TaskFormHandle>(null)

  const [values, setValues] = useState<TaskFormValues>(INITIAL_TASK_FORM_VALUES)
  const [fieldErrors, setFieldErrors] = useState<TaskFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [createdTask, setCreatedTask] = useState<Task | null>(null)

  const handleFieldChange = <TField extends TaskField>(
    field: TField,
    value: TaskFormValues[TField],
  ) => {
    setValues((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
    setFormError(null)
  }

  const showFieldErrors = (errors: TaskFieldErrors) => {
    setFieldErrors(errors)

    const firstInvalidField = findFirstInvalidField(errors, TASK_FIELDS)

    if (firstInvalidField) {
      formRef.current?.focusField(firstInvalidField)
    }
  }

  /**
   * After a successful create the form is cleared for the next task. There is
   * no task list to redirect to yet.
   */
  const handleSubmit = async () => {
    setFormError(null)
    setCreatedTask(null)

    const validationErrors = validateTaskForm(values)

    if (hasValidationErrors(validationErrors)) {
      showFieldErrors(validationErrors)

      return
    }

    setFieldErrors({})

    const result = await createTask(toCreateTaskPayload(values))

    if (result.isSuccess) {
      setCreatedTask(result.task)
      setValues(INITIAL_TASK_FORM_VALUES)
      formRef.current?.focusField('title')

      return
    }

    const serverFieldErrors = toFirstFieldErrors(
      result.error.fieldErrors,
      TASK_FIELDS,
    )

    if (hasValidationErrors(serverFieldErrors)) {
      showFieldErrors(serverFieldErrors)

      return
    }

    setFormError(result.error.message)
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <PageHeader
        eyebrow="Task management"
        title="Create task"
        description="Capture what needs doing, then set its status, priority and due date."
      />

      {createdTask && (
        <Alert variant="success">
          Task <span className="font-semibold">“{createdTask.title}”</span> was
          created. You can add another one below.
        </Alert>
      )}

      {formError && <Alert>{formError}</Alert>}

      <TaskForm
        ref={formRef}
        values={values}
        errors={fieldErrors}
        isSubmitting={isCreating}
        submitLabel="Create task"
        submittingLabel="Creating…"
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.dashboard)}
      />
    </div>
  )
}

export default CreateTaskPage
