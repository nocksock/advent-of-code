#[allow(dead_code)]

const RED: u8 = 12;
const GREEN: u8 = 13;
const BLUE: u8 = 14;

fn power(min_cubes: (usize, usize, usize)) -> usize {
    min_cubes.0 * min_cubes.1 * min_cubes.2
}

fn is_possible(input: String) -> bool  {
    for draw in input.split(":").last().expect("No draws").split(";") {
        for cubes in draw.split(",") {
            let mut parts = cubes.trim().split(" ");
            let count: u8 = parts.next().expect("No count").parse().unwrap();
            let color = parts.next().expect("No color");
            if !match color {
                "red" => count <= RED,
                "green" => count <= GREEN,
                "blue" => count <= BLUE,
                v => panic!("Unknown color {}", v),
            } {
                return false
            }
        }
    }

    true
}

fn min_cubes(input: String) -> (usize, usize, usize)  {
    let mut min_red = 0;
    let mut min_green = 0;
    let mut min_blue = 0;

    for draw in input.split(":").last().expect("No draws").split(";") {
        for cubes in draw.split(",") {
            let mut parts = cubes.trim().split(" ");
            let count: usize = parts.next().expect("No count").parse().unwrap();
            let color = parts.next().expect("No color");
            match color {
                "red" => if count >= min_red {
                    min_red = count as usize;
                },
                "green" => if count >= min_green {
                    min_green = count as usize;
                },
                "blue" => if count >= min_blue {
                    min_blue = count as usize;
                },
                v => panic!("Unknown color {}", v),
            };
        }
    }

    (min_red, min_green, min_blue)
}

pub fn solve(input: Vec<String>, part_b: bool) -> usize {
    if part_b {
        input.into_iter().map(|line| {
            power(min_cubes(line))
        }).sum()
    } else {
        input.into_iter().enumerate().filter_map(|(index, line)| {
            if is_possible(line) {
                Some(index + 1)
            } else {
                None
            }
        }).sum()
    }
}

#[cfg(test)]
mod test {
    use crate::day02::*;
    use aoc::utils::*;

    #[test]
    fn test_sample_a() {
        assert!(is_possible(String::from("Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green")));
        assert!(!is_possible(String::from("Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red")));
        let sample = read_input("02.sample");
        assert_eq!(solve(sample, false), 8);
    }

    #[test]
    fn test_sample_b() {
        assert_eq!((4,2,6), min_cubes(String::from("Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green")));
        assert_eq!(48, power(min_cubes(String::from("Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"))));
        assert_eq!((20,13,6), min_cubes(String::from("Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red")));
        let sample = read_input("02.sample");
        assert_eq!(solve(sample, true), 2286);
    }

}
