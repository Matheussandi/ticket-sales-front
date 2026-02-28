import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { env } from "../../config/env";

/**
 * HTTP Client
 *
 * Wrapper sobre axios com configurações padrão e interceptors.
 * Gerencia autenticação automática via token JWT.
 */
export class HttpClient {
	private axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			baseURL: env.apiBaseUrl,
			timeout: env.apiTimeout,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.setupInterceptors();
	}

	/**
	 * Configura interceptors de request e response
	 */
	private setupInterceptors(): void {
		// Request interceptor - adiciona token automaticamente
		this.axiosInstance.interceptors.request.use(
			(config) => {
				const token = this.getStoredToken();
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			},
		);

		// Response interceptor - trata erros globalmente
		this.axiosInstance.interceptors.response.use(
			(response) => response,
			async (error) => {
				if (error.response?.status === 401) {
					this.clearStoredToken();
					localStorage.removeItem("@tickethub:user");
					window.location.href = '/login';
				}

				// Personaliza mensagens de erro
				const message = error.response?.data?.message || error.message;
				return Promise.reject(new Error(message));
			},
		);
	}

	async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.axiosInstance.get<T>(url, config);
		return response.data;
	}

	async post<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response = await this.axiosInstance.post<T>(url, data, config);
		return response.data;
	}

	async put<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response = await this.axiosInstance.put<T>(url, data, config);
		return response.data;
	}

	async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.axiosInstance.delete<T>(url, config);
		return response.data;
	}

	async patch<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response = await this.axiosInstance.patch<T>(url, data, config);
		return response.data;
	}

	setToken(token: string): void {
		localStorage.setItem("@tickethub:token", token);
	}

	clearToken(): void {
		this.clearStoredToken();
	}

	private getStoredToken(): string | null {
		return localStorage.getItem("@tickethub:token");
	}

	private clearStoredToken(): void {
		localStorage.removeItem("@tickethub:token");
	}
}
