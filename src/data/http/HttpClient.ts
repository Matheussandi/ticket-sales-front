import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { env } from "../../config/env";

export interface HttpClientOptions {
	/** Chamado em 401 — ex.: limpar UserStorage e redirecionar (apenas no browser). */
	onUnauthorized?: () => void;
}

/** Config estendida: sondagens de sessão não devem disparar redirect global em 401. */
export type HttpRequestConfig = AxiosRequestConfig & {
	skipUnauthorizedRedirect?: boolean;
};

/**
 * HTTP Client
 *
 * Wrapper sobre axios com configurações padrão e interceptors.
 * Autenticação via cookie httpOnly (`withCredentials: true`).
 */
export class HttpClient {
	private axiosInstance: AxiosInstance;
	private readonly onUnauthorized?: () => void;

	constructor(options?: HttpClientOptions) {
		this.onUnauthorized = options?.onUnauthorized;
		this.axiosInstance = axios.create({
			baseURL: env.apiBaseUrl,
			timeout: env.apiTimeout,
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.setupInterceptors();
	}

	private setupInterceptors(): void {
		this.axiosInstance.interceptors.response.use(
			(response) => response,
			async (error) => {
				if (error.response?.status === 401) {
					const cfg = error.config as HttpRequestConfig | undefined;
					if (!cfg?.skipUnauthorizedRedirect) {
						this.onUnauthorized?.();
					}
				}

				const message = error.response?.data?.message || error.message;
				return Promise.reject(new Error(message));
			},
		);
	}

	async get<T>(url: string, config?: HttpRequestConfig): Promise<T> {
		const response = await this.axiosInstance.get<T>(url, config);
		return response.data;
	}

	async post<T>(
		url: string,
		data?: unknown,
		config?: HttpRequestConfig,
	): Promise<T> {
		const response = await this.axiosInstance.post<T>(url, data, config);
		return response.data;
	}

	async put<T>(
		url: string,
		data?: unknown,
		config?: HttpRequestConfig,
	): Promise<T> {
		const response = await this.axiosInstance.put<T>(url, data, config);
		return response.data;
	}

	async delete<T>(url: string, config?: HttpRequestConfig): Promise<T> {
		const response = await this.axiosInstance.delete<T>(url, config);
		return response.data;
	}

	async patch<T>(
		url: string,
		data?: unknown,
		config?: HttpRequestConfig,
	): Promise<T> {
		const response = await this.axiosInstance.patch<T>(url, data, config);
		return response.data;
	}
}
