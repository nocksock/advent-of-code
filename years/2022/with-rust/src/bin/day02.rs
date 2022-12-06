const DRAW: i32 = 3;
const LOSS: i32 = 0;
const WIN: i32 = 6;
const ROCK: i32 = 1;
const PAPER: i32 = 2;
const SCISSORS: i32 = 3;

fn main() {
    let result = include_str!("../../../02.input")
        .trim()
        .split("\n")
        .map(|line| line.trim().split(" ").collect())
        .map(|round: String| {
            let moves = round.chars().take(2).collect::<Vec<char>>();
            return (
                parse_round_a(moves[0], moves[1]),
                parse_round_b(moves[0], moves[1]),
            );
        })
        .reduce(|acc, cv| (acc.0 + cv.0, acc.1 + cv.1))
        .unwrap();

    println!("A: {}, B: {}", result.0, result.1);
}

fn parse_round_a(a: char, b: char) -> i32 {
    match a {
        'A' => match b {
            'X' => ROCK + DRAW,
            'Y' => PAPER + WIN,
            'Z' => SCISSORS + LOSS,
            _ => panic!(),
        },
        'B' => match b {
            'X' => ROCK + LOSS,
            'Y' => PAPER + DRAW,
            'Z' => SCISSORS + WIN,
            _ => panic!(),
        },
        'C' => match b {
            'X' => ROCK + WIN,
            'Y' => PAPER + LOSS,
            'Z' => SCISSORS + DRAW,
            _ => panic!(),
        },
        _ => panic!(),
    }
}

fn parse_round_b(a: char, b: char) -> i32 {
    match a {
        'A' => match b {
            'X' => SCISSORS + LOSS,
            'Y' => ROCK + DRAW,
            'Z' => PAPER + WIN,
            _ => panic!(),
        },
        'B' => match b {
            'X' => ROCK + LOSS,
            'Y' => PAPER + DRAW,
            'Z' => SCISSORS + WIN,
            _ => panic!(),
        },
        'C' => match b {
            'X' => PAPER + LOSS,
            'Y' => SCISSORS + DRAW,
            'Z' => ROCK + WIN,
            _ => panic!(),
        },
        _ => panic!(),
    }
}
