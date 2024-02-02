import React, { useEffect, useCallback, useRef } from 'react';
// make API calls and pass the returned data via dispatch

interface ImageRange {
    start: number;
    length: number;
};

enum ImageFetchAction {
    FETCHING_IMAGES,
    STACK_IMAGES,
    STOP_FETCHING,
};

enum PagerAction {
    ADVANCE_PAGE
};

function getImageURL(imageRange: ImageRange) {
    return `https://picsum.photos/v2/list?start=${imageRange.start}&length=${imageRange.length}`
}

const useFetch = (imageRange: ImageRange,
                  dispatch: (action: {name: ImageFetchAction, images?: []}) => void) => {
    useEffect(() => {
        dispatch({name: ImageFetchAction.FETCHING_IMAGES });
        fetch(getImageURL(imageRange))
            .then(data => data.json())
            .then(images => {
                dispatch({ name: ImageFetchAction.STACK_IMAGES, images: images });
                dispatch({ name: ImageFetchAction.STOP_FETCHING });
            })
            .catch(e => {
                dispatch({ name: ImageFetchAction.STOP_FETCHING });
                return e;
            })
    }, [dispatch, imageRange])
}

const useInfiniteScroll = (scrollRef: {current: HTMLElement | null}, dispatch: (action: PagerAction) => void) => {
    const scrollObserver = useCallback(
        (node: HTMLElement) => {
            new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0) {
                        dispatch(PagerAction.ADVANCE_PAGE);
                    }
                });
            }).observe(node);
        },
        [dispatch]
    );
    useEffect(() => {
        if (scrollRef.current) {
            scrollObserver(scrollRef.current);
        }
    }, [scrollObserver, scrollRef]);
}

const useLazyLoading = (imgSelector: string, items: []) => {
    const imgObserver = useCallback((node: HTMLElement) => {
        const intObs = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.intersectionRatio > 0) {
                    const currentImg = en.target as HTMLImageElement;
                    const newImgSrc = currentImg.dataset.src;
                    // only swap out the image source if the new url exists
                    if (!newImgSrc) {
                        console.error('Image source is invalid');
                    } else {
                        currentImg.src = newImgSrc;
                    }
                    intObs.unobserve(node); // detach the observer when done
                }
            });
        });
        intObs.observe(node);
    }, []);
    const imagesRef: React.MutableRefObject<null | NodeListOf<HTMLImageElement>> = useRef(null);
    useEffect(() => {
        imagesRef.current = document.querySelectorAll(imgSelector) as NodeListOf<HTMLImageElement>;
        if (imagesRef.current) {
            imagesRef.current.forEach(img => imgObserver(img));
        }
    }, [imgObserver, imagesRef, imgSelector, items])
}

export {useFetch, useInfiniteScroll, useLazyLoading, ImageFetchAction, PagerAction, ImageRange}
