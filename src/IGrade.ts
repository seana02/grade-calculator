interface IGrade {
    get desc(): string;
    get ptsPossible(): number;
    get ptsEarned(): number;
    get percent(): number;
    get weight(): number;
    get gradesList(): IGrade[]
    toJSON(): { [key: string]: any };
}

export default IGrade;
