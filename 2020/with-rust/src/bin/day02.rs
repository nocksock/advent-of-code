fn main() {
    let input = include_str!("../../../02.input")
        .lines()
        .collect::<Vec<&str>>();

    println!("Part 1: {}", count_valid_passwords(input));
}

fn count_valid_passwords(passwords: Vec<&str>) -> i16 {
    passwords.iter().filter(|p| is_valid(p)).count() as i16
}

fn is_valid(password: &str) -> bool {
    let mut parts = password.split_whitespace();
    return match (parts.next(), parts.next(), parts.next()) {
        (Some( range ), Some( chararcter ), Some( pass )) => {
            let range = range.split("-")
                .map(|n| { n.parse::<u16>().unwrap() })
                .collect::<Vec<u16>>();
            let needle = chararcter.chars().next();
            let mut count: u16 = 0;
            pass.chars().into_iter().for_each(|c| {
                if Some(c) == needle {
                    count+=1
                }
            });


            return count >= range[0] && count <= range[1];
        },
        _ => false
    };
}

#[cfg(test)]
mod test {
    use crate::{count_valid_passwords, is_valid};

    #[test]
    fn test_sample_a() {
        let input = vec![
            "1-3 a: abcde",
            "1-3 b: cdefg",
            "2-9 c: ccccccccc,",
        ];

        assert_eq!(2, count_valid_passwords(input))
    }

    #[test]
    fn test_is_valid() {
        assert!(is_valid("1-3 a: abcde"));
        assert!(!is_valid("1-3 b: cdefg"));
    }
}
