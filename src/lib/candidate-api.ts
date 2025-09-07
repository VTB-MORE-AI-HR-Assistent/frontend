export type UploadStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "COMPLETED_WITH_ERRORS"
  | "FAILED"

export type UploadErrorCode =
  | "TIKA_EXTRACTION_FAILED"
  | "OPENAI_TIMEOUT"
  | "OPENAI_PARSING_FAILED"
  | "PERSISTENCE_ERROR"
  | "PROCESSING_ERROR"

export interface UploadItemView {
  id: number
  filename: string
  status: UploadStatus
  candidateId?: number
  email?: string
  errorCode?: UploadErrorCode
  errorMessage?: string
}

export interface UploadCreateResponse {
  uploadId: string
  status: UploadStatus
  items: UploadItemView[]
}

export interface UploadStatusResponse {
  uploadId: string
  status: UploadStatus
  createdAt: string
  items: UploadItemView[]
}

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api"

export async function uploadCVs(files: File[], jobId?: number | null): Promise<UploadCreateResponse> {
  if (!files || files.length === 0) throw new Error("No files provided")
  const form = new FormData()
  if (jobId != null) form.append("jobId", String(jobId))
  for (const f of files) form.append("files", f, f.name)

  const token = typeof window !== 'undefined' ? localStorage.getItem('vtb_access_token') : null
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${getBaseUrl()}/v1/candidates/uploads`, {
    method: "POST",
    headers,
    body: form,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Upload failed with status ${res.status}`)
  }
  return (await res.json()) as UploadCreateResponse
}

export async function getUploadStatus(uploadId: string): Promise<UploadStatusResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('vtb_access_token') : null
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${getBaseUrl()}/v1/candidates/uploads/${uploadId}`, { headers })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Status request failed with status ${res.status}`)
  }
  return (await res.json()) as UploadStatusResponse
}

export async function pollUploadStatus(
  uploadId: string,
  intervalMs = 2000,
  timeoutMs = 10 * 60 * 1000
): Promise<UploadStatusResponse> {
  const start = Date.now()
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const status = await getUploadStatus(uploadId)
    if (
      status.status === "COMPLETED" ||
      status.status === "COMPLETED_WITH_ERRORS" ||
      status.status === "FAILED"
    ) {
      return status
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error("Polling timeout exceeded")
    }
    await new Promise((r) => setTimeout(r, intervalMs))
  }
}
