#[derive(Debug, PartialEq)]
enum Direction {
    Inc,
    Dec,
}

fn part_a(input: &str) -> usize {
    parse(input)
        .into_iter()
        .filter(|report| is_safe(report))
        .count()
}

fn parse(input: &str) -> Vec<Vec<i32>> {
    input
        .lines()
        .map(|line| {
            line.split(" ")
                .map(|num| num.parse::<i32>().unwrap())
                .collect()
        })
        .collect::<Vec<_>>()
}

fn is_safe(vec: &[i32]) -> bool {
    let dir = if vec[0] < vec[1] {
        Direction::Inc
    } else {
        Direction::Dec
    };

    vec.windows(2).all(|w| match dir {
        Direction::Inc => w[0] < w[1] && w[1] - w[0] <= 3,
        Direction::Dec => w[0] > w[1] && w[0] - w[1] <= 3,
    })
}

fn main() {
    let result = part_a(include_str!("../../../02.input"));
    println!("{:?}", result);
}

#[cfg(test)]
mod test {
    use crate::*;
    #[test]
    fn test_is_safe() {
        assert!(is_safe(&vec![7, 6, 4, 2, 1]));
        assert!(!is_safe(&vec![1, 2, 7, 8, 9]));
        assert!(!is_safe(&vec![9, 7, 6, 2, 1]));
        assert!(!is_safe(&vec![1, 3, 2, 4, 5]));
        assert!(!is_safe(&vec![8, 6, 4, 4, 1]));
        assert!(is_safe(&vec![1, 3, 6, 7, 9]));
    }

    #[test]
    fn test_part_a_sample() {
        let result = part_a(include_str!("../../../02.sample"));
        assert_eq!(2, result);
    }

    #[test]
    fn test_part_a_regression() {
        let result = part_a(include_str!("../../../02.input"));
        assert_eq!(result, 218);
    }
}
