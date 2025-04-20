import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

type Review = {
  id: string
  rating: number
  comment: string
  createdAt: string
  username: string
  productName?: string
}

const ProductReviews = () => {
  const { productId } = useParams()
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [ratingStats, setRatingStats] = useState<{
    average: number
    totalCount: number
    breakdown: { [key: number]: number }
  } | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 4

  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')
  const sortReviews = (reviews: Review[]) => {
    switch (sortOption) {
      case 'newest':
        return [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'oldest':
        return [...reviews].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case 'highest':
        return [...reviews].sort((a, b) => b.rating - a.rating)
      case 'lowest':
        return [...reviews].sort((a, b) => a.rating - b.rating)
      default:
        return reviews
    }
  }
  const sortedReviews = sortReviews(filteredReviews)
  const paginatedReviews = sortedReviews.slice(
  (currentPage - 1) * reviewsPerPage,
  currentPage * reviewsPerPage
  )
  const totalPages = Math.ceil((filteredReviews.length > 0 ? filteredReviews.length : reviews.length) / reviewsPerPage)


  const handleFilter = (rating: number) => {
    setSelectedRating(rating)
    const filtered = reviews.filter(r => r.rating === rating)
    setFilteredReviews(filtered)
    setCurrentPage(1)
  }

  const resetFilter = () => {
    setSelectedRating(null)
    setFilteredReviews(reviews)
    setCurrentPage(1)
  }

  useEffect(() => {
    fetch(`/api/v2/review/seller/${productId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setReviews(data)
        setFilteredReviews(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Fetch error:', err)
        setError(true)
        setLoading(false)
      })
  }, [productId])

  useEffect(() => {
    fetch(`/api/v2/review/stats/${productId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setRatingStats(data)
      })
      .catch(err => {
        console.error('Rating stats error:', err)
      })
  }, [productId])

  if (loading) return <p className="p-4">Loading reviews...</p>
  if (error) return <p className="p-4 text-red-500">Error fetching reviews.</p>

  return (
    <div className="pt-[100px] px-4">
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/*Name*/}
          <div className="bg-zinc-900 p-4 rounded-lg shadow-md border border-zinc-700">
            <p className="text-zinc-400 text-sm mb-1">Reviews for</p>
            <h1 className="text-2xl font-bold text-zinc-100">
              {reviews[0]?.productName ?? 'this product'}
            </h1>
          </div>

          {/*Stats*/}
          <div className="bg-zinc-900 p-4 rounded-lg shadow-md border border-zinc-700">
            <p className="text-zinc-400 text-sm mb-2">Rating Stats</p>
            {ratingStats ? (
              <div className="flex flex-row gap-4 items-start">
                <div className="basis-1/4 flex flex-col justify-start">
                  <h2 className="text-2xl font-bold text-yellow-400">
                    ⭐ {ratingStats.average.toFixed(1)}
                  </h2>
                  <p className="text-zinc-400 text-sm font-normal">
                    ({ratingStats.totalCount} reviews)
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    {(() => {
                      if (ratingStats.average >= 4.5) return 'Mostly Positive'
                      if (ratingStats.average >= 3) return 'Positive'
                      return 'Negative'
                    })()}
                  </p>
                </div>
                <div className="basis-3/4 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-right text-zinc-300">{star} ⭐</span>
                      <div className="flex-1 bg-zinc-700 h-3 rounded">
                        <div
                          className="bg-yellow-400 h-3 rounded"
                          style={{ width: `${ratingStats.breakdown[star] ?? 0}%` }}
                        ></div>
                      </div>
                      <span className="w-10 text-right text-zinc-400">
                        {ratingStats.breakdown[star] ?? 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Loading...</p>
            )}
          </div>

          {/*Latest*/}
          <div className="bg-zinc-900 p-4 rounded-lg shadow-md border border-zinc-700">
            <p className="text-zinc-400 text-sm mb-2">Latest Review</p>
            <p className="text-sm text-zinc-100 italic">
              “{reviews[0]?.comment.slice(0, 80)}...”
            </p>
            <p className="text-xs text-zinc-400 mt-2">
              — {reviews[0]?.username}
            </p>
            <p className="text-xs text-zinc-400">
              {new Date(reviews[0]?.createdAt).toLocaleString('en-GB', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })} • ⭐ {reviews[0]?.rating}
            </p>
          </div>
        </div>
      )}

      {/*Filter and Sort*/}
      <div className="mb-6 flex flex-wrap gap-2 justify-end">
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            className={`px-3 py-1 rounded-md border text-sm transition-all ${
              selectedRating === star
                ? 'bg-yellow-400 text-black font-semibold'
                : 'bg-zinc-800 text-white border-zinc-600 hover:bg-zinc-700'
            }`}
            onClick={() => handleFilter(star)}
          >
            {star} ⭐
          </button>
        ))}
        <button
          onClick={resetFilter}
          className="px-3 py-1 bg-zinc-800 text-white rounded-md text-sm border border-zinc-600 hover:bg-zinc-700"
        >
          Reset
        </button>
      </div>
      <div className="mb-4 flex justify-end items-center gap-2">
        <label htmlFor="sort" className="text-sm text-zinc-400">Sort by:</label>
        <select
          id="sort"
          className="bg-zinc-800 text-white text-sm px-2 py-1 rounded border border-zinc-600"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as any)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews */}
      {paginatedReviews.length === 0 ? (
        <p className="text-center text-lg sm:text-xl text-zinc-400 py-10 font-medium">
          No reviews yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paginatedReviews.map((review) => (
            <div
              key={review.id}
              className="border border-zinc-700 bg-zinc-900 rounded-lg p-4 shadow-sm text-zinc-100"
            >
              <div className="flex items-center justify-between border-b border-zinc-700 pb-2 mb-2">
                <div>
                  <p className="font-semibold text-zinc-100">{review.username}</p>
                </div>
                <p className="text-yellow-400 font-bold text-sm">⭐ {review.rating}</p>
              </div>
              <p className="text-sm text-zinc-300">{review.comment}</p>
              <p className="text-xs text-zinc-500 mt-2 text-right">
                {new Date(review.createdAt).toLocaleString('en-GB', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredReviews.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 bg-zinc-800 text-zinc-100 rounded hover:bg-zinc-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-zinc-400 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-1 bg-zinc-800 text-zinc-100 rounded hover:bg-zinc-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductReviews
