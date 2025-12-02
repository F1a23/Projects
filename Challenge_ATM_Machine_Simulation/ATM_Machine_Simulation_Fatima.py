pin = "1234"
balance = 100.0
attempts = 0

while attempts < 3:
    entered = input("Enter your PIN: ")

    if entered == pin:
        print("Welcome!")
        attempts = 3  
    else:
        print("Incorrect PIN. Try again.")
        attempts = attempts + 1


if entered == pin:
    option = ""

    while option != "4":
        print("\n1. Check Balance")
        print("2. Deposit Money")
        print("3. Withdraw Money")
        print("4. Exit")

        option = input("Choose an option: ")

        if option == "1":
            print("Your balance is", balance, "OMR")

        elif option == "2":
            deposit = float(input("Enter deposit amount: "))
            balance = balance + deposit
            print("Deposit successful! New balance is", balance, "OMR")

        elif option == "3":
            withdraw = float(input("Enter withdraw amount: "))
            if withdraw <= balance:
                balance = balance - withdraw
                print("Withdrawal successful! New balance is", balance, "OMR")
            else:
                print("Insufficient balance.")

        elif option == "4":
            print("Thank you for using our ATM!")

        else:
            print("Invalid option. Please try again.")
else:
    print("Account locked. Try again later.")
