import { useRef, useState } from 'react'
import { Upload, X, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileUploadFieldProps {
  value?: File | null
  onChange: (file: File | null) => void
  accept?: string
  maxSizeMB?: number
  /** URL of an already-uploaded file (edit mode), shown as a link. */
  existingFileUrl?: string | null
  existingFileName?: string | null
  label?: string
  disabled?: boolean
}

export function FileUploadField({
  value,
  onChange,
  accept,
  maxSizeMB = 10,
  existingFileUrl,
  existingFileName,
  label = 'Drag & drop a file or browse',
  disabled,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const accept_ = accept

  function handleFile(file: File | null) {
    setError(null)
    if (!file) {
      onChange(null)
      return
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max ${maxSizeMB}MB.`)
      return
    }
    onChange(file)
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
          disabled && 'opacity-50 pointer-events-none',
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFile(e.dataTransfer.files?.[0] ?? null)
        }}
      >
        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground text-center">{label}</p>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="mt-1"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          Browse
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept_}
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          disabled={disabled}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {value && (
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
          <div className="flex items-center gap-2 truncate">
            <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate">{value.name}</span>
            <span className="text-xs text-muted-foreground shrink-0">
              ({(value.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleFile(null)}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!value && existingFileUrl && (
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
          <div className="flex items-center gap-2 truncate">
            <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
            <a
              href={existingFileUrl}
              target="_blank"
              rel="noreferrer"
              className="truncate text-primary hover:underline"
            >
              {existingFileName ?? 'Current attachment'}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
