/**
 * Environment Variables Configuration
 * 
 * Provides type-safe access to environment variables.
 * All variables are validated at runtime.
 */

interface EnvConfig {
	apiBaseUrl: string;
	apiTimeout: number;
	isDevelopment: boolean;
	isProduction: boolean;
}

function getEnvVar(key: string, defaultValue?: string): string {
	const value = import.meta.env[key] ?? defaultValue;
	if (!value) {
		throw new Error(`Missing environment variable: ${key}`);
	}
	return value;
}

function validateEnvVars(): EnvConfig {
	const apiBaseUrl = getEnvVar("VITE_API_BASE_URL");
	const apiTimeout = Number.parseInt(
		getEnvVar("VITE_API_TIMEOUT", "30000"),
		10,
	);

	const mode = import.meta.env.MODE;

	return {
		apiBaseUrl,
		apiTimeout,
		isDevelopment: mode === "development",
		isProduction: mode === "production",
	};
}

export const env = validateEnvVars();
