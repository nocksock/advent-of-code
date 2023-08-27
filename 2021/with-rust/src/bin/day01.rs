fn main() {
    let input = include_str!("../../../01.input").lines().map(|l| l.parse::<usize>().unwrap()).collect::<Vec<usize>>();
    println!("Part 1: {}", find_pair_sum(input.clone(), 2020));
}

fn find_pair_sum(items: Vec<usize>, sum: usize) -> usize {
    let mut offset = 0;
    for a in 0..items.len() {
        for b in offset..items.len() {
            if items[a] + items[b] == sum {
                return items[a] * items[b];
            }
        }

        offset += 1;
    }

    panic!("Not found");
}

#[cfg(test)]
mod test {
use crate::find_pair_sum;
#[test]
    fn test_input() {
        let items = vec![1721, 979, 366, 299, 675, 1456];
        assert_eq!(514579, find_pair_sum(items, 2020))
    }
}
