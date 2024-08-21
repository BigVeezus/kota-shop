package middlewares

import "strings"

func RemoveExtraQuotes(s string) string {
	// Check if the string starts with a quote
	if strings.HasPrefix(s, "\"") {
		// Remove the starting quote
		s = s[1:]
	}

	// Check if the string ends with a quote
	if strings.HasSuffix(s, "\"") {
		// Remove the ending quote
		s = s[:len(s)-1]
	}

	// Return the modified string
	return s
}
