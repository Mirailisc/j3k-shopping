import { useCallback, useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Star, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ReviewDisplay } from '@/types/review'
import Gravatar from 'react-gravatar'
import ReviewForm from './ReviewForm'
import { axiosInstance } from '@/lib/axios'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import Loading from '@/pages/Loading'

type Props = {
  productId: string
  productName: string
}

const Reviews: React.FC<Props> = ({ productId, productName }: Props) => {
  const [reviews, setReviews] = useState<ReviewDisplay[] | null>(null)
  const [sortOption, setSortOption] = useState('newest')
  const [expandedReviews, setExpandedReviews] = useState<string[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)

  const getReviews = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/review/product/${productId}`)
      setReviews(res.data)
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }, [productId])

  useEffect(() => {
    getReviews()
  }, [getReviews])

  if (!reviews) {
    return <Loading />
  }

  const averageRating = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length || 0
  const roundedRating = Math.round(averageRating * 10) / 10

  const ratingCounts = Array(5)
    .fill(0)
    .map((_, index) => {
      const starRating = 5 - index
      return reviews.filter((review) => review.rating === starRating).length
    })

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews((prev) => (prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]))
  }

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < rating ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground'}`}
        />
      ))
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {showReviewForm ? (
          <ReviewForm productId={productId} productName={productName} setShowReviewForm={setShowReviewForm} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Rating Summary */}
            <div className="md:col-span-1 space-y-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-4xl font-bold">{roundedRating}</span>
                  <div className="flex flex-col">
                    <div className="flex">{renderStars(Math.round(averageRating))}</div>
                    <span className="text-sm text-muted-foreground">Based on {reviews.length} reviews</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {ratingCounts.map((count, index) => {
                  const starRating = 5 - index
                  const percentage = (count / reviews.length) * 100 || 0
                  return (
                    <div key={starRating} className="flex items-center gap-2">
                      <div className="flex items-center w-16">
                        <span className="text-sm">{starRating}</span>
                        <Star className="h-3 w-3 ml-1 fill-primary text-primary" />
                      </div>
                      <Progress value={percentage} className="h-2 flex-1" />
                      <span className="text-sm w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>

              <Button variant="outline" className="w-full" onClick={() => setShowReviewForm(true)}>
                Write a Review
              </Button>
            </div>

            {/* Reviews List */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </h3>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Rated</SelectItem>
                    <SelectItem value="lowest">Lowest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-6">
                {sortedReviews.map((review) => {
                  const isExpanded = expandedReviews.includes(review.id)
                  const formattedDate = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
                  const isLongReview = review.comment.length > 300

                  return (
                    <div key={review.id} className="space-y-3">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Gravatar email={review.email} size={40} className="rounded-full" />
                          <div>
                            <div className="font-medium">{review.fullName}</div>
                            <div className="text-sm text-muted-foreground">{formattedDate}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                        </div>
                        <div className="mt-2">
                          {(() => {
                            // Short review - always show full content
                            if (!isLongReview) {
                              return <p className="text-muted-foreground">{review.comment}</p>
                            }

                            // Long review - collapsed state
                            if (!isExpanded) {
                              return (
                                <>
                                  <p className="text-muted-foreground">{review.comment.substring(0, 300)}...</p>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 h-auto mt-1"
                                    onClick={() => toggleReviewExpansion(review.id)}
                                  >
                                    Read more <ChevronDown className="h-3 w-3 ml-1" />
                                  </Button>
                                </>
                              )
                            }

                            // Long review - expanded state
                            return (
                              <>
                                <p className="text-muted-foreground">{review.comment}</p>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto mt-1"
                                  onClick={() => toggleReviewExpansion(review.id)}
                                >
                                  Show less <ChevronUp className="h-3 w-3 ml-1" />
                                </Button>
                              </>
                            )
                          })()}
                        </div>
                      </div>
                      <Separator />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Reviews
