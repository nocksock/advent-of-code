fn main() {
    println!("foo")
}

#[allow(dead_code)]
fn find_marker_index(input: &str) -> i32 {
    input.split("").reduce(|stack, cursor| 
        match stack {
            &str => {

            },
            i32 => stack
        }
    );

    return 2
}


#[cfg(test)]
mod tests {
    use crate::find_marker_index;

    #[test]
    fn test_find_marker_index() {
        assert_eq!(find_marker_index(&"mjqjpqmgbljsphdztnvjfqwrcgsmlb".to_string()), 5)
    }
}
