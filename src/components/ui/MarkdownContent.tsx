import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { marqueAffichee } from "@/lib/brand";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn("prose prose-icare max-w-none", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{marqueAffichee(content)}</ReactMarkdown>
    </div>
  );
}