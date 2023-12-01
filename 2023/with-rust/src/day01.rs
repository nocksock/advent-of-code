fn extract(input: String, strict: bool) -> u32 {
    let digits: Vec<u32> = input
        .chars()
        .enumerate()
        .filter_map(|(i, c)| match c.is_digit(10) {
            true => Some(c.to_digit(10).unwrap()),
            _ => {
                if !strict {
                    input.get(i..input.len()).and_then(|s| {
                        if s.starts_with("one") {
                            Some(1)
                        } else if s.starts_with("two") {
                            Some(2)
                        } else if s.starts_with("three") {
                            Some(3)
                        } else if s.starts_with("four") {
                            Some(4)
                        } else if s.starts_with("five") {
                            Some(5)
                        } else if s.starts_with("six") {
                            Some(6)
                        } else if s.starts_with("seven") {
                            Some(7)
                        } else if s.starts_with("eight") {
                            Some(8)
                        } else if s.starts_with("nine") {
                            Some(9)
                        } else {
                            None
                        }
                    })
                } else {
                    None
                }
            }
        })
        .collect();

    let a = digits.first().unwrap();
    let b = digits.last().unwrap();

    return a * 10 + b;
}

pub fn solve(input: Vec<String>, strict: bool) -> u32 {
    let digits = input.iter().map(|line| extract(line.to_string(), strict)).collect();

    sum(digits)
}

fn sum(input: Vec<u32>) -> u32 {
    input.into_iter().fold(0, |acc, cv| acc + cv)
}

#[cfg(test)]
mod test {
    use crate::day01::{extract, solve};
    use aoc::utils::*;

    #[test]
    fn test_extract() {
        assert_eq!(14, extract("oneasdfasdffourasdf".to_string(), false));
        assert_eq!(25, extract("oneas2dfasd5ffourasdf".to_string(), true));
    }

    #[test]
    fn test_sample_a() {
        let sample = read_input("01.sample");
        assert_eq!(142, solve(sample, true));
    }

    #[test]
    fn test_sample_b() {
        let str = "abcdefg";
        let foo = str.get(1..str.len());
        println!("{:?}", foo);
        let sample = vec![
            ("two1nine", 29),
            ("eightwothree", 83),
            ("abcone2threexyz", 13),
            ("xtwone3four", 24),
            ("4nineeightseven2", 42),
            ("zoneight234", 14),
            ("7pqrstsixteen", 76),
        ];

        for (input, expected) in sample {
            assert_eq!(expected, extract(input.to_string(), false));
        }
    }
}
