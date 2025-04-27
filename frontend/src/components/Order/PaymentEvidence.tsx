import type React from 'react'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Check, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { isAxiosError } from 'axios'
import { axiosInstance } from '@/lib/axios'

interface PaymentEvidenceProps {
  orderId: string
  existingEvidence: string
}

export default function PaymentEvidence({ orderId, existingEvidence }: PaymentEvidenceProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadStatus('idle')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) return

    setIsUploading(true)
    setUploadStatus('idle')

    try {
      const formData = new FormData()
      formData.append('evidence', file)

      await axiosInstance.patch(`/order/evidence/${orderId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setUploadStatus('success')
    } catch (error) {
      setUploadStatus('error')

      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        setErrorMessage(errorMessage)
      } else {
        setErrorMessage('Failed to upload payment evidence. Please try again.')
      }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="border border-black/20 dark:border-white/10">
      <CardHeader>
        <CardTitle>Payment Evidence</CardTitle>
        <CardDescription>Upload proof of payment to confirm your order</CardDescription>
      </CardHeader>
      <CardContent>
        {existingEvidence ? (
          <div className="space-y-4">
            <Alert variant="default">
              <Check className="h-4 w-4" />
              <AlertTitle>Evidence Uploaded</AlertTitle>
              <AlertDescription>Your payment evidence has been uploaded and is being reviewed.</AlertDescription>
            </Alert>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-black/20 dark:border-white/10">
              <img src={existingEvidence || '/placeholder.svg'} alt="Payment evidence" className="object-cover" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="evidence">Upload Receipt</Label>
                <div className="flex items-center gap-2">
                  <Input id="evidence" type="file" accept="image/*" onChange={handleFileChange} className="flex-1" />
                </div>
                <p className="text-sm text-muted-foreground">Accepted formats: JPG, PNG, PDF (max 5MB)</p>
              </div>

              {file && (
                <div className="text-sm">
                  Selected file: <span className="font-medium">{file.name}</span>
                </div>
              )}

              {uploadStatus === 'success' && (
                <Alert variant="default">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Upload Successful</AlertTitle>
                  <AlertDescription>Your payment evidence has been uploaded successfully.</AlertDescription>
                </Alert>
              )}

              {uploadStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Upload Failed</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button type="submit" className="mt-4 w-full" disabled={!file || isUploading}>
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">
                    <Upload className="h-4 w-4" />
                  </span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Evidence
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Your order will be processed once payment is confirmed.
      </CardFooter>
    </Card>
  )
}
