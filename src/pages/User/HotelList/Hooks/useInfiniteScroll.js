import { useEffect } from "react";

export const useInfiniteScroll = ({
  viewMode,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  observerRef,
  loadMoreRef,
  lastLoadTimeRef
}) => {

  useEffect(() => {

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (viewMode !== "infinite" || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {

      const [entry] = entries;
      const now = Date.now();

      if (now - lastLoadTimeRef.current < 500) return;

      if (entry.isIntersecting && !isFetchingNextPage) {

        console.log("observer trigger");

        lastLoadTimeRef.current = now;
        fetchNextPage();
      }

    }, { threshold: 0.1 });

    const sentinel = loadMoreRef.current;

    if (sentinel) {
      observer.observe(sentinel);
      observerRef.current = observer;
    }

    return () => observer.disconnect();

  }, [
    viewMode,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  ]);
};