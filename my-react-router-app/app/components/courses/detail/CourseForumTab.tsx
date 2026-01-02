import { ArrowLeft, Clock, Flag, MessageCircle, MessageSquare, Plus, Send, Share2, ThumbsUp, User } from "lucide-react";
import React, { useRef, useEffect } from "react";
import type { ForumTopic, ForumPost, TranslationType } from "~/types/courseDetail";

interface CourseForumTabProps {
  language: string;
  t: TranslationType;
  forumView: "list" | "thread";
  forumTopics: ForumTopic[];
  selectedTopic: ForumTopic | null;
  currentUser: string;
  replyContent: string;
  onSetReplyContent: (val: string) => void;
  onCreateTopicClick: () => void;
  onTopicClick: (topic: ForumTopic) => void;
  onBackToTopics: () => void;
  onPostReply: (e: React.FormEvent) => void;
}

export function CourseForumTab({
  language,
  t,
  forumView,
  forumTopics,
  selectedTopic,
  currentUser,
  replyContent,
  onSetReplyContent,
  onCreateTopicClick,
  onTopicClick,
  onBackToTopics,
  onPostReply,
}: CourseForumTabProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forumView === "thread" && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [forumView, selectedTopic?.posts]);

  return (
    <div className="space-y-10 animate-in fade-in duration-600">
      {forumView === "list" && (
        <>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
            <div>
              <h3 className="text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-3">
                {t.forum}
              </h3>
              <p className="text-lg text-muted-foreground font-medium max-w-2xl">
                {language === "de"
                  ? "Vernetze dich mit deinen Kommilitonen, diskutiere Kursinhalte und teile dein Wissen."
                  : "Connect with your fellow students, discuss course content and share your knowledge."}
              </p>
            </div>
            <button
              onClick={onCreateTopicClick}
              className="px-8 py-5 bg-iu-blue text-white font-black rounded-2xl hover:bg-iu-blue transition-all shadow-xl shadow-iu-blue/25 active:scale-95 flex items-center gap-3 group"
            >
              <Plus
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              {t.createTopic}
            </button>
          </div>

          <div className="grid gap-5">
            {forumTopics.length === 0 ? (
              <div className="rounded-[3rem] border-2 border-dashed border-border/40 p-20 text-center bg-muted/5">
                <MessageSquare
                  size={48}
                  className="mx-auto text-muted-foreground opacity-20 mb-6"
                />
                <p className="text-muted-foreground font-bold">
                  Noch keine Diskussionen gestartet. Sei der Erste!
                </p>
              </div>
            ) : (
              forumTopics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => onTopicClick(topic)}
                  className={`group relative rounded-[2.5rem] p-10 border transition-all duration-500 cursor-pointer shadow-sm hover:shadow-2xl ${
                    topic.status === "pinned"
                      ? "bg-iu-orange/5 border-iu-orange/20 hover:border-iu-orange/40"
                      : "bg-card/40 backdrop-blur-xl border-border/40 hover:border-iu-blue/30"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-5">
                        {topic.status === "pinned" && (
                          <div className="p-2 rounded-xl bg-iu-orange text-white shadow-lg animate-bounce duration-1000">
                            <Flag size={14} className="fill-current" />
                          </div>
                        )}
                        <h4 className="text-2xl font-black text-foreground truncate group-hover:text-iu-blue transition-colors tracking-tight">
                          {topic.title}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">
                        <div className="flex items-center gap-3 py-1.5 px-3 rounded-xl bg-muted/40 border border-border/30">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-iu-blue to-iu-blue text-white flex items-center justify-center font-black">
                            {topic.author.charAt(0)}
                          </div>
                          <span className="text-foreground">
                            {topic.author}
                          </span>
                        </div>
                        <span className="flex items-center gap-2">
                          <Clock size={12} className="text-iu-blue/40" />
                          {topic.lastPost}
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1 bg-iu-blue/5 rounded-lg text-iu-blue">
                          <MessageCircle size={12} />
                          {topic.replies} Replies
                        </span>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/30 group-hover:bg-iu-blue group-hover:text-white transition-all duration-500 shadow-inner">
                      <ArrowLeft
                        size={24}
                        className="rotate-180 group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {forumView === "thread" && selectedTopic && (
        <div className="animate-in slide-in-from-right-8 duration-500 flex flex-col h-[calc(100vh-12rem)]">
          {/* Thread Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border/40 flex-shrink-0">
            <button
              onClick={onBackToTopics}
              className="p-4 rounded-2xl bg-muted/50 hover:bg-iu-blue hover:text-white transition-all group shadow-sm active:scale-95"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                {selectedTopic.status === "pinned" && (
                  <span className="px-2 py-0.5 rounded-lg bg-iu-orange/10 text-iu-orange text-[9px] font-black uppercase tracking-wider border border-iu-orange/20">
                    Pinned
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-lg bg-iu-blue/10 text-iu-blue text-[9px] font-black uppercase tracking-wider border border-iu-blue/20">
                  Discussion
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight truncate">
                {selectedTopic.title}
              </h3>
            </div>
            <button className="p-4 rounded-2xl bg-muted/30 hover:bg-card border border-transparent hover:border-border/50 text-muted-foreground hover:text-foreground transition-all">
              <Share2 size={20} />
            </button>
          </div>

          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto pr-4 space-y-8 -mr-4 pb-4 scroll-smooth">
            {/* Original Post */}
            <div className="bg-card/40 backdrop-blur-md rounded-[2.5rem] border border-border/40 p-8 sm:p-10 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-border/30">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-iu-blue to-iu-blue text-white flex items-center justify-center text-xl font-black shadow-lg shadow-iu-blue/20">
                    {selectedTopic.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-lg font-black text-foreground">
                      {selectedTopic.author}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                      <span>Student</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{selectedTopic.lastPost}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                <p className="text-foreground/90 leading-relaxed font-medium">
                  {selectedTopic.content}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 hover:bg-iu-blue/10 hover:text-iu-blue transition-colors text-xs font-black uppercase tracking-wider text-muted-foreground">
                  <ThumbsUp size={14} /> Like
                </button>
              </div>
            </div>

            {/* Replies */}
            {selectedTopic.posts.map((post: ForumPost) => (
              <div
                key={post.id}
                className={`flex gap-6 ${post.author === currentUser ? "flex-row-reverse" : ""}`}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-lg ${
                      post.author === currentUser
                        ? "bg-iu-blue text-white shadow-iu-blue/20"
                        : "bg-card border border-border text-foreground"
                    }`}
                  >
                    {post.author.charAt(0)}
                  </div>
                </div>
                <div
                  className={`max-w-[80%] rounded-3xl p-8 border shadow-sm ${
                    post.author === currentUser
                      ? "bg-iu-blue/5 border-iu-blue/10 rounded-tr-none"
                      : "bg-card border-border/40 rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center justify-between gap-8 mb-4">
                    <span className="font-black text-foreground text-sm">
                      {post.author}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider opacity-60">
                      {post.date}
                    </span>
                  </div>
                  <p className="text-foreground/90 font-medium leading-relaxed">
                    {post.content}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Input - Fixed at bottom of container */}
          <div className="mt-8 pt-6 border-t border-border/40 flex-shrink-0">
            <form onSubmit={onPostReply} className="relative">
              <div className="absolute left-6 top-6 p-2 rounded-xl bg-muted/50 text-muted-foreground">
                <User size={20} />
              </div>
              <textarea
                value={replyContent}
                onChange={(e) => onSetReplyContent(e.target.value)}
                placeholder={
                  language === "de"
                    ? "Schreibe eine Antwort..."
                    : "Write a reply..."
                }
                className="w-full bg-card/60 backdrop-blur-xl border border-border/50 rounded-[2rem] pl-20 pr-20 py-6 min-h-[100px] focus:outline-none focus:border-iu-blue/50 focus:ring-4 focus:ring-iu-blue/5 transition-all resize-none shadow-lg text-lg font-medium placeholder:text-muted-foreground/40"
              />
              <button
                type="submit"
                disabled={!replyContent.trim()}
                className="absolute right-4 top-4 p-4 rounded-2xl bg-iu-blue text-white shadow-xl shadow-iu-blue/20 hover:bg-iu-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                <Send size={20} className="fill-current" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
