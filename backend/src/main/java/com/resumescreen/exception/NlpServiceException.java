package com.resumescreen.exception;

/**
 * Thrown when the FastAPI NLP microservice is unreachable or returns an
 * unexpected/error response. Mapped to HTTP 502 (Bad Gateway) since the
 * failure originates from a downstream dependency, not the client's request.
 */
public class NlpServiceException extends RuntimeException {
    public NlpServiceException(String message) {
        super(message);
    }

    public NlpServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
