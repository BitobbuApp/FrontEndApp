export type NormalizedApiError = {
  code: string;
  status: number;
  category: string;
  message: string;
  details: unknown;
  traceId?: string;
};

export function normalizeApiError(payload: any, httpStatus?: number): NormalizedApiError {
  const e = payload?.error ?? {};
  return {
    code: e.code ?? "INTERNAL_SERVER_ERROR",
    status: e.status ?? httpStatus ?? 500,
    category: e.category ?? "INTERNAL",
    message: e.message ?? payload?.message ?? "An unexpected error occurred",
    details: e.details ?? payload?.details ?? payload?.errors ?? {},
    traceId: e.traceId
  };
}

export type ErrorMessageLocale = {
  message_es: string;
  message_en: string;
};

const MASTER_ERROR_CATALOG: Record<string, ErrorMessageLocale> = {
  VALIDATION_ERROR: {
    message_en: "Please review the highlighted fields.",
    message_es: "Por favor revisa los campos resaltados."
  },
  AUTH_MISSING_TOKEN: {
    message_en: "Your session is missing. Please sign in again.",
    message_es: "Falta tu sesión. Por favor inicia sesión nuevamente."
  },
  AUTH_INVALID_TOKEN: {
    message_en: "Your session expired. Please sign in again.",
    message_es: "Tu sesión expiró. Por favor inicia sesión nuevamente."
  },
  USER_INVALID_CREDENTIALS: {
    message_en: "Email or password is incorrect.",
    message_es: "Correo o contraseña incorrectos."
  },
  USER_NOT_FOUND: {
    message_en: "We could not find that user.",
    message_es: "No pudimos encontrar ese usuario."
  },
  USER_ALREADY_EXISTS: {
    message_en: "An account with this email already exists.",
    message_es: "Ya existe una cuenta con este correo."
  },
  COMPANY_NOT_FOUND: {
    message_en: "Company not found.",
    message_es: "Compañía no encontrada."
  },
  COMPANY_ALREADY_EXISTS: {
    message_en: "A company with this Tax ID already exists.",
    message_es: "Ya existe una compañía con este RFC/Tax ID."
  },
  LOCATION_NOT_FOUND: {
    message_en: "Location not found.",
    message_es: "Ubicación no encontrada."
  },
  CONTACT_NOT_FOUND: {
    message_en: "Contact not found.",
    message_es: "Contacto no encontrado."
  },
  COMPANY_PRIMARY_CONTACT_DELETE_FORBIDDEN: {
    message_en: "Set another primary contact before deleting this one.",
    message_es: "Establece otro contacto principal antes de eliminar este."
  },
  COMPANY_MAIN_HEADQUARTERS_DELETE_FORBIDDEN: {
    message_en: "Set another main location before deleting this one.",
    message_es: "Establece otra ubicación principal antes de eliminar esta."
  },
  REQUEST_NOT_FOUND: {
    message_en: "Request not found.",
    message_es: "Solicitud no encontrada."
  },
  QUOTE_RESPONSE_NOT_FOUND: {
    message_en: "Quote response not found.",
    message_es: "Respuesta de cotización no encontrada."
  },
  QUOTE_RESPONSE_DUPLICATE: {
    message_en: "A quote response for this request already exists.",
    message_es: "Ya existe una respuesta de cotización para esta solicitud."
  },
  QUOTE_RESPONSE_INVALID_TRANSITION: {
    message_en: "This status change is not allowed.",
    message_es: "Este cambio de estado no está permitido."
  },
  QUOTE_RESPONSE_UNAUTHORIZED_ACTOR: {
    message_en: "You do not have permission for this action.",
    message_es: "No tienes permiso para esta acción."
  },
  TRANSACTION_NOT_FOUND: {
    message_en: "Transaction not found.",
    message_es: "Transacción no encontrada."
  },
  TRANSACTION_DUPLICATE: {
    message_en: "A transaction already exists for this quote response.",
    message_es: "Ya existe una transacción para esta respuesta de cotización."
  },
  TRANSACTION_INVALID_TRANSITION: {
    message_en: "This status change is not allowed.",
    message_es: "Este cambio de estado no está permitido."
  },
  TRANSACTION_UNAUTHORIZED_ACTOR: {
    message_en: "You do not have permission for this action.",
    message_es: "No tienes permiso para esta acción."
  },
  REVIEW_NOT_FOUND: {
    message_en: "Review not found.",
    message_es: "Revisión no encontrada."
  },
  REVIEW_UNAUTHORIZED_ACTOR: {
    message_en: "You cannot submit this review.",
    message_es: "No puedes enviar esta revisión."
  },
  REVIEW_ALREADY_SUBMITTED: {
    message_en: "You already submitted this review.",
    message_es: "Ya enviaste esta revisión."
  },
  REVIEW_PERIOD_EXPIRED: {
    message_en: "Review period has expired.",
    message_es: "El periodo de revisión ha expirado."
  },
  BUSINESS_ERROR: {
    message_en: "This operation cannot be completed right now.",
    message_es: "Esta operación no puede completarse en este momento."
  },
  INTERNAL_SERVER_ERROR: {
    message_en: "Something went wrong. Please try again.",
    message_es: "Algo salió mal. Por favor, inténtalo de nuevo."
  }
};

export function getUserFriendlyErrorMessage(
  error: NormalizedApiError,
  language: "en" | "es" = "es"
): string {
  const langKey = `message_${language}` as keyof ErrorMessageLocale;

  // 1. Prioritize error code match
  if (error.code && MASTER_ERROR_CATALOG[error.code]) {
    return MASTER_ERROR_CATALOG[error.code][langKey];
  }

  // 2. Fallback based on HTTP status / Category
  if (error.status === 401) {
    return MASTER_ERROR_CATALOG.AUTH_INVALID_TOKEN[langKey];
  }
  if (error.status === 403) {
    return language === "es"
      ? "No tienes permisos suficientes para esta acción."
      : "You do not have permission for this action.";
  }
  if (error.status === 404) {
    return language === "es" ? "Recurso no encontrado." : "Resource not found.";
  }
  if (error.status === 409) {
    return language === "es"
      ? "Conflicto con la solicitud. Por favor, actualice e intente nuevamente."
      : "Conflict with the request. Please refresh and try again.";
  }
  if (error.status === 400 || error.category === "VALIDATION") {
    return MASTER_ERROR_CATALOG.VALIDATION_ERROR[langKey];
  }

  // 3. Fallback to 500 / Generic
  return MASTER_ERROR_CATALOG.INTERNAL_SERVER_ERROR[langKey];
}
