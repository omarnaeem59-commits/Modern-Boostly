/**
 * Comments storage utilities
 */

const COMMENTS_STORAGE_KEY = "boostly_comments_"

export interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorInitials: string
  authorPhoto?: string
  content: string
  timestamp: Date
  likes: number
}

export function getPostComments(postId: string): Comment[] {
  try {
    const comments = localStorage.getItem(`${COMMENTS_STORAGE_KEY}${postId}`)
    if (comments) {
      const parsed = JSON.parse(comments)
      // Convert date strings back to Date objects
      return parsed.map((c: any) => ({
        ...c,
        timestamp: new Date(c.timestamp),
      }))
    }
    return []
  } catch {
    return []
  }
}

export function savePostComments(postId: string, comments: Comment[]) {
  try {
    localStorage.setItem(`${COMMENTS_STORAGE_KEY}${postId}`, JSON.stringify(comments))
  } catch (error) {
    console.error("Error saving comments:", error)
  }
}

export function addComment(postId: string, comment: Comment) {
  const comments = getPostComments(postId)
  comments.push(comment)
  savePostComments(postId, comments)
  return comments
}

export function updateCommentLikes(postId: string, commentId: string, likes: number) {
  const comments = getPostComments(postId)
  const updated = comments.map(c => 
    c.id === commentId ? { ...c, likes } : c
  )
  savePostComments(postId, updated)
  return updated
}

