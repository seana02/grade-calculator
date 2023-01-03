interface IGrade {
    get desc(): string;
    get ptsPossible(): number;
    get ptsEarned(): number;
    get percent(): number;
    get weight(): number;
    toJSON(): { [key: string]: any };
}

export default IGrade;
