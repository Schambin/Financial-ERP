import readline from 'readline';

export class CLIUtils {
    static async question(rl: readline.Interface, question: string): Promise<string> {
        return new Promise((resolve) => {
            rl.question(question, resolve);
        });
    }

    static async validateInput(
        rl: readline.Interface,
        question: string,
        validation: (input: string) => string | true): Promise<string> {
        while (true) {
            const answer = await CLIUtils.question(rl, question);
            const validationResult = validation(answer);

            if (validationResult == true) {
                return answer;
            }

            console.log(validationResult);
        }
    }
}