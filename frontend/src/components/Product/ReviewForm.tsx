import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useNavigate } from 'react-router-dom'
import { SIGN_IN_PATH } from '@/constants/routes'
import { isAxiosError } from 'axios'
import { axiosInstance } from '@/lib/axios'

type Props = {
  productId: string
  productName: string
  setShowReviewForm: React.Dispatch<React.SetStateAction<boolean>>
}

const ReviewForm: React.FC<Props> = ({ productId, productName, setShowReviewForm }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (rating === 0) {
      newErrors.rating = 'Please select a rating'
    }

    if (!comment.trim()) {
      newErrors.comment = 'Please enter your review'
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const newReview = {
        productId,
        rating,
        comment,
      }
      await axiosInstance.post('/review/product', newReview)

      toast.success('Review submitted successfully')

      setRating(0)
      setComment('')
      setErrors({})
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setShowReviewForm(false)
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(SIGN_IN_PATH, { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>Share your experience with {productName}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    aria-label={`Rate ${star} stars out of 5`}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-primary text-primary'
                          : 'fill-muted text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && <p className="text-sm text-destructive">{errors.rating}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="What did you like or dislike? How was your experience using this product?"
              rows={5}
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              className={errors.comment ? 'border-destructive' : ''}
            />
            {errors.comment && <p className="text-sm text-destructive">{errors.comment}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex mt-4 justify-between">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default ReviewForm
