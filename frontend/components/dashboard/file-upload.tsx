"use client"

import { useState, useCallback } from "react"
import { Upload, X, FileText, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
}

export function FileUpload({ files, onFilesChange }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )

      onFilesChange([...files, ...droppedFiles])
    },
    [files, onFilesChange]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files)
        onFilesChange([...files, ...selectedFiles])
      }
    },
    [files, onFilesChange]
  )

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index)
      onFilesChange(newFiles)
    },
    [files, onFilesChange]
  )

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/40 hover:bg-muted/30"
        )}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleFileInput}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Upload resume files"
        />
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300",
              isDragging 
                ? "bg-primary/15 shadow-lg shadow-primary/20" 
                : "bg-muted"
            )}
          >
            <Upload
              className={cn(
                "h-7 w-7 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground/70"
              )}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isDragging ? "Drop files here" : "Drag and drop resume files"}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              or click to browse <span className="text-primary/70">(PDF, DOC, DOCX)</span>
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Uploaded files
            </p>
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              <CheckCircle2 className="h-3 w-3" />
              {files.length} file{files.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="max-h-[200px] space-y-2 overflow-y-auto pr-1">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="group flex items-center justify-between rounded-xl border border-border/50 bg-card px-4 py-3 shadow-sm transition-all hover:border-border hover:shadow-md"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="shrink-0 h-8 w-8 text-muted-foreground/50 opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
