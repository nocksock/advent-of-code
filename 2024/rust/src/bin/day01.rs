use itertools::Itertools;

fn part_a(input: &str) -> i32 {
    let mut input = input
        .lines()
        .map(|line| {
            str::split(line, "   ")
                .map(|num| num.parse::<i32>().unwrap())
                .collect::<Vec<_>>()
        })
        .fold([Vec::<i32>::new(), Vec::<i32>::new()], |mut acc, e| {
            acc[0].push(*e.get(0).unwrap());
            acc[1].push(*e.get(1).unwrap());
            acc
        });

    input.iter_mut().for_each(|list| list.sort());

    return (0..input[0].len())
        .map(|i| (input[0][i] - input[1][i]).abs())
        .reduce(|acc, n| acc + n)
        .unwrap();
}

fn part_b(input: &str) -> usize {
    let (left, right): (Vec<_>, Vec<_>) = input
        .lines()
        .map(|line| {
            line.split_once("   ")
                .map(|(a, b)| (a.parse::<usize>().unwrap(), b.parse::<usize>().unwrap()))
                .unwrap()
        })
        .unzip();

    let counts = right.into_iter().counts();

    left.into_iter()
        .map(|n| n * counts.get(&n).unwrap_or(&0))
        .sum()
}

fn main() {
    println!("a: {:?}", part_a(include_str!("../../../01.input")));
    println!("b: {:?}", part_b(include_str!("../../../01.input")));
}

#[cfg(test)]
mod test {
    use crate::*;

    #[test]
    fn test_part_a_sample() {
        let result = part_a(include_str!("../../../01.sample"));
        assert_eq!(result, 11);
    }

    #[test]
    fn test_part_b_sample() {
        let result = part_b(include_str!("../../../01.sample"));
        assert_eq!(result, 31);
    }
}
