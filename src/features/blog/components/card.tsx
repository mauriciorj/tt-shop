import { Clock, User, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { BlogPost } from '@/blog/types'

const Card = ({
  post,
  featured = false,
}: {
  post: BlogPost
  featured?: boolean
}) => (
  <article
    className={`group glass-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg ${
      featured ? 'md:col-span-2 md:grid md:grid-cols-2' : ''
    }`}
    key={post.id}
  >
    <div className={`overflow-hidden ${featured ? 'h-64 md:h-full' : 'h-48'}`}>
      <img
        src={post.image}
        alt={post.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    </div>
    <div className="p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="secondary" className="text-xs">
            {post.category}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </span>
        </div>
        <h2
          className={`font-bold leading-tight mb-2 group-hover:text-primary transition-colors ${
            featured ? 'text-2xl' : 'text-lg'
          }`}
        >
          {post.title}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
          {post.short_description}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>·</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </time>
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Ler <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  </article>
)

export default Card
