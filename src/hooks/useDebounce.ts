import { useEffect, useState } from "react";

/**
 * Hook customizado para debounce de valores
 * Útil para otimizar chamadas de API em inputs de busca
 *
 * @param value - Valor a ser debounced
 * @param delay - Delay em milissegundos (padrão: 500ms)
 * @returns Valor debounced
 */
export function useDebounce<T>(value: T, delay = 500): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Define um timer para atualizar o valor após o delay
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Limpa o timer se o valor mudar antes do delay terminar
		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}
