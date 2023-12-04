use std::collections::HashSet;

pub fn parse(line: &str) -> Vec<usize> {
    let sets = line.split(":").last().unwrap().split("|");
    let numbers = sets
        .map(|part| {
            part.split(" ")
                .filter_map(|n| n.parse::<usize>().ok())
                .collect::<HashSet<usize>>()
        })
        .collect::<Vec<HashSet<usize>>>();

    numbers[0].intersection(&numbers[1]).cloned().collect()
}

pub fn solve(lines: Vec<String>, part_b: bool) -> usize {
    let max: usize = lines.len();
    let mut deck = vec![1; max];

    if part_b {
        for (i, line) in lines.iter().enumerate() {
            for id in max.min(i + 1)..=max.min(i + parse(line).len()) {
                deck[id] += deck[i];
            }
        }
        return deck.iter().sum::<usize>();
    }

    return lines.iter().map(|line| {
        match parse(line).len() {
            0 => 0,
            count => 2_usize.pow(count.checked_sub(1).unwrap().try_into().unwrap()),
        }
    }).sum();
}

#[cfg(test)]
mod test {
    use crate::day04::{parse, solve};
    use crate::utils::*;

    #[test]
    fn test_day4_a() {
        let row = "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53".to_string();
        let expected: Vec<usize> = vec![48, 17, 83, 86];
        for n in expected {
            assert!(parse(&row).contains(&n));
        }
        let sample = read_input("04.sample");
        assert_eq!(13, solve(sample, false))
    }

    #[test]
    fn test_day4_b() {
        let sample = read_input("04-b.sample");
        assert_eq!(30, solve(sample, true));
    }

    #[test]
    fn test_day4_b_input() {
        let sample = read_input("04.input");
        assert_eq!(5329815, solve(sample, true));
    }
}
