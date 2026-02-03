const Breadcrumb = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="mb-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-2">
        Top TikTok <span className="gradient-text">{title}</span>
      </h1>
      <p className="text-muted-foreground text-lg">{description}</p>
    </div>
  )
}

export default Breadcrumb
