export const downloadFile = (content: string, filename: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

const stripMarkdown = (markdown: string): string => {
  return markdown
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/^-{3,}$/gm, "")
    .trim();
};

export const exportAsMarkdown = (topic: string, content: string) => {
  const safeTopic = topic.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
  downloadFile(content, `${safeTopic || "report"}.md`, "text/markdown");
};

export const exportAsText = (topic: string, content: string) => {
  const safeTopic = topic.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
  downloadFile(stripMarkdown(content), `${safeTopic || "report"}.txt`, "text/plain");
};

export const printReport = () => {
  window.print();
};