export function splitSentenceByCharCount(strSentence: string, rowCharLimit: number): string[] {
	const arrWords: string[] = strSentence.split(' ')
	const arrWordLen: number[] = arrWords.map(function (word) {
		return word.length
	})
	let i: number,
		rowCharCounter: number = 0,
		countHolder: number,
		arrRows: string[][] = [],
		arrThisRow: string[] = []
	for (i = 0; i < arrWords.length; i++) {
		// how many char this row will be with this word
		countHolder = rowCharCounter + arrWordLen[i]
		if (countHolder < rowCharLimit) { // if within char limit
			rowCharCounter = countHolder // add to char count
			arrThisRow.push(arrWords[i]) // add word to row
		} else { // if row over char limit
			arrRows.push(arrThisRow) // arrThisRow decided
			arrThisRow = [arrWords[i]] // reset
			rowCharCounter = 0 // reset row char count
		}
		if (i === arrWords.length - 1) { // if end of array
			arrRows.push(arrThisRow) // collect final row
		}
	}
	return arrRows.reduce(function (prev, arrRowWords) {
		if (arrRowWords.length > 0) {
			prev.push(arrRowWords.join(' '))
		}
		return prev
	}, [])
}
